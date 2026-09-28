(function () {
  'use strict';

  var root = document.getElementById('audio-converter');
  if (!root) return;

  var input = document.getElementById('audioFileInput');
  var dropZone = document.getElementById('audioDropZone');
  var queueEl = document.getElementById('audioQueue');
  var queueCount = document.getElementById('audioQueueCount');
  var convertButton = document.getElementById('audioConvertButton');
  var clearButton = document.getElementById('audioClearQueue');
  var qualitySelect = document.getElementById('audioQuality');
  var statusEl = document.getElementById('audioStatus');
  var maxFiles = 30;
  var maxFileBytes = 300 * 1024 * 1024;
  var encryptedPattern = /\.(ncm|qmc(?:\d+)?|mgg(?:\d+)?|mflac(?:\d+)?|tkm|kwm|x2m|x3m)$/i;
  var mp3Rates = [8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000];
  var queue = [];
  var busy = false;
  var nextId = 1;
  var audioContext = null;
  var encoderPromise = null;
  var vendorPromise = null;

  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }

  function outputName(name) {
    return String(name || 'audio').replace(/\.[^.]+$/, '') + '.mp3';
  }

  function pickSampleRate(rate) {
    var chosen = mp3Rates[0];
    for (var i = 0; i < mp3Rates.length; i += 1) {
      if (rate >= mp3Rates[i]) chosen = mp3Rates[i];
    }
    return chosen;
  }

  function getBitrate() {
    var value = qualitySelect ? parseInt(qualitySelect.value, 10) : 320;
    return [128, 192, 256, 320].indexOf(value) !== -1 ? value : 320;
  }

  function yieldToBrowser() {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, 0);
    });
  }

  function ensureAudioContext() {
    var Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) {
      return Promise.reject(new Error('当前浏览器不支持 Web Audio 解码'));
    }
    if (!audioContext) audioContext = new Context();
    if (audioContext.state === 'suspended' && audioContext.resume) {
      return audioContext.resume().then(function () { return audioContext; });
    }
    return Promise.resolve(audioContext);
  }

  function loadVendor() {
    if (window.WasmMediaEncoder) return Promise.resolve(window.WasmMediaEncoder);
    if (vendorPromise) return vendorPromise;

    vendorPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-wasm-media-encoder]');
      var script = existing || document.createElement('script');
      function loaded() {
        if (window.WasmMediaEncoder) resolve(window.WasmMediaEncoder);
        else reject(new Error('MP3 编码器初始化失败'));
      }
      function failed() {
        vendorPromise = null;
        reject(new Error('MP3 编码器加载失败，请检查网络后重试'));
      }
      if (existing) {
        if (window.WasmMediaEncoder) loaded();
        else {
          existing.addEventListener('load', loaded, { once: true });
          existing.addEventListener('error', failed, { once: true });
        }
        return;
      }
      script.src = '/vendor/wasm-media-encoders/WasmMediaEncoder.min.js';
      script.async = true;
      script.dataset.wasmMediaEncoder = 'true';
      script.addEventListener('load', loaded, { once: true });
      script.addEventListener('error', failed, { once: true });
      document.head.appendChild(script);
    });

    return vendorPromise;
  }

  function getEncoder() {
    if (!encoderPromise) {
      encoderPromise = loadVendor().then(function (library) {
        if (!library || typeof library.createEncoder !== 'function') {
          throw new Error('MP3 编码器接口不可用');
        }
        return fetch('/vendor/wasm-media-encoders/mp3.wasm').then(function (response) {
          if (!response.ok) throw new Error('MP3 编码核心加载失败');
          return response.arrayBuffer();
        }).then(function (wasmBinary) {
          return library.createEncoder('audio/mpeg', wasmBinary);
        });
      }).catch(function (error) {
        encoderPromise = null;
        throw error;
      });
    }
    return encoderPromise;
  }

  function decodeFile(file) {
    return file.arrayBuffer().then(function (arrayBuffer) {
      return ensureAudioContext().then(function (context) {
        return new Promise(function (resolve, reject) {
          var settled = false;
          function ok(buffer) {
            if (settled) return;
            settled = true;
            resolve(buffer);
          }
          function fail() {
            if (settled) return;
            settled = true;
            reject(new Error('无法解码此文件，请确认它是未加密且浏览器支持的音频格式'));
          }
          try {
            var result = context.decodeAudioData(arrayBuffer.slice(0), ok, fail);
            if (result && typeof result.then === 'function') result.then(ok, fail);
          } catch (error) {
            fail();
          }
        });
      });
    });
  }

  function renderPcm(buffer, channels, sampleRate) {
    if (buffer.numberOfChannels === channels && buffer.sampleRate === sampleRate) {
      return Promise.resolve(buffer);
    }
    var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OfflineContext) {
      throw new Error('当前浏览器不支持音频重采样，请升级 Safari 或 Chrome');
    }
    var length = Math.max(1, Math.ceil(buffer.duration * sampleRate));
    var offline = new OfflineContext(channels, length, sampleRate);
    var source = offline.createBufferSource();
    source.buffer = buffer;
    source.connect(offline.destination);
    source.start(0);
    return offline.startRendering();
  }

  function encodePcm(buffer, encoder, bitrate, onProgress) {
    var channels = Math.min(buffer.numberOfChannels, 2);
    var sourceChannels = [];
    for (var c = 0; c < channels; c += 1) sourceChannels.push(buffer.getChannelData(c));
    var sampleLength = buffer.length;
    var chunkLength = 13824;
    var parts = [];
    var offset = 0;

    encoder.configure({
      sampleRate: buffer.sampleRate,
      channels: channels,
      bitrate: bitrate,
      outputSampleRate: buffer.sampleRate
    });

    function finish() {
      var tail = encoder.finalize();
      if (tail && tail.length) parts.push(new Uint8Array(tail));
      if (!parts.length) throw new Error('编码结果为空');
      var blob = new Blob(parts, { type: 'audio/mpeg' });
      return blob;
    }

    function step() {
      var end = Math.min(sampleLength, offset + chunkLength);
      var chunk = [];
      for (var channel = 0; channel < channels; channel += 1) {
        chunk.push(sourceChannels[channel].subarray(offset, end));
      }
      var encoded = encoder.encode(chunk);
      if (encoded && encoded.length) parts.push(new Uint8Array(encoded));
      offset = end;
      if (onProgress) onProgress(35 + Math.round((offset / sampleLength) * 63));
      if (offset >= sampleLength) return finish();
      return null;
    }

    return new Promise(function (resolve, reject) {
      var stepIndex = 0;
      function pump() {
        try {
          var result = null;
          var operations = 24;
          while (operations > 0 && offset < sampleLength && !result) {
            result = step();
            operations -= 1;
            stepIndex += 1;
          }
          if (result) {
            resolve(result);
            return;
          }
          if (offset >= sampleLength) {
            resolve(finish());
            return;
          }
          if (stepIndex % 8 === 0) window.setTimeout(pump, 0);
          else pump();
        } catch (error) {
          reject(error);
        }
      }
      pump();
    });
  }

  function stateLabel(item) {
    if (item.state === 'done') return '已完成';
    if (item.state === 'error') return item.blocked ? '未支持' : '失败';
    if (item.state === 'converting') return '转换中';
    if (item.state === 'decoding') return '解码中';
    if (item.state === 'encoding') return '编码中';
    return '等待转换';
  }

  function createRow(item) {
    var row = document.createElement('article');
    row.className = 'audio-queue-item';
    row.dataset.audioItem = String(item.id);

    var main = document.createElement('div');
    main.className = 'audio-item-main';

    var badge = document.createElement('span');
    badge.className = 'audio-file-badge';
    badge.textContent = 'MP3';

    var info = document.createElement('div');
    info.className = 'audio-file-info';
    var name = document.createElement('strong');
    name.textContent = item.file.name;
    name.title = item.file.name;
    var meta = document.createElement('small');
    meta.className = 'audio-file-meta';
    meta.textContent = formatBytes(item.file.size) + ' · ' + stateLabel(item);
    info.appendChild(name);
    info.appendChild(meta);

    var state = document.createElement('span');
    state.className = 'audio-item-state';
    state.textContent = stateLabel(item);

    main.appendChild(badge);
    main.appendChild(info);
    main.appendChild(state);

    var track = document.createElement('div');
    track.className = 'audio-progress-track';
    var fill = document.createElement('i');
    track.appendChild(fill);

    var foot = document.createElement('div');
    foot.className = 'audio-item-foot';
    var message = document.createElement('span');
    message.className = 'audio-item-message';
    message.textContent = item.message || '';
    var download = document.createElement('a');
    download.className = 'audio-download-link';
    download.download = item.outputName;
    download.textContent = '下载 MP3';
    download.hidden = true;
    foot.appendChild(message);
    foot.appendChild(download);

    row.appendChild(main);
    row.appendChild(track);
    row.appendChild(foot);
    item.row = row;
    item.metaEl = meta;
    item.stateEl = state;
    item.fillEl = fill;
    item.messageEl = message;
    item.downloadEl = download;
    return row;
  }

  function updateRow(item) {
    if (!item.row) return;
    item.row.dataset.state = item.state;
    if (item.metaEl) item.metaEl.textContent = formatBytes(item.file.size) + ' · ' + stateLabel(item);
    if (item.stateEl) item.stateEl.textContent = stateLabel(item);
    if (item.fillEl) item.fillEl.style.width = Math.max(0, Math.min(100, item.progress || 0)) + '%';
    if (item.messageEl) item.messageEl.textContent = item.message || '';
    if (item.downloadEl) {
      if (item.resultUrl) {
        item.downloadEl.href = item.resultUrl;
        item.downloadEl.download = item.outputName;
        item.downloadEl.hidden = false;
      } else {
        item.downloadEl.hidden = true;
      }
    }
  }

  function renderQueue() {
    if (!queueEl) return;
    queueEl.textContent = '';
    if (!queue.length) {
      var empty = document.createElement('div');
      empty.className = 'audio-queue-empty';
      empty.textContent = '还没有文件。拖入未加密音频，或点击左侧选择文件。';
      queueEl.appendChild(empty);
    } else {
      queue.forEach(function (item) {
        if (!item.row) createRow(item);
        queueEl.appendChild(item.row);
        updateRow(item);
      });
    }
    if (queueCount) queueCount.textContent = queue.length + ' 个文件';
    if (convertButton) {
      convertButton.disabled = busy || !queue.some(function (item) {
        return item.state !== 'done' && !item.blocked;
      });
    }
    if (clearButton) clearButton.disabled = busy || !queue.length;
  }

  function addFiles(fileList) {
    var files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return;
    var available = maxFiles - queue.length;
    if (available <= 0) {
      if (statusEl) statusEl.textContent = '单次最多处理 ' + maxFiles + ' 个文件';
      return;
    }
    files.slice(0, available).forEach(function (file) {
      var item = {
        id: nextId++,
        file: file,
        outputName: outputName(file.name),
        state: 'ready',
        progress: 0,
        message: '等待转换',
        resultUrl: '',
        blocked: false
      };
      if (encryptedPattern.test(file.name)) {
        item.state = 'error';
        item.blocked = true;
        item.message = 'NCM / QQ 加密或受保护格式不支持；请先使用未加密源文件';
      } else if (file.size > maxFileBytes) {
        item.state = 'error';
        item.blocked = true;
        item.message = '文件超过 300 MB，请先拆分或压缩后重试';
      } else if (!file.size) {
        item.state = 'error';
        item.blocked = true;
        item.message = '空文件无法转换';
      }
      queue.push(item);
    });
    if (files.length > available && statusEl) {
      statusEl.textContent = '本次已加入 ' + available + ' 个，单次最多 ' + maxFiles + ' 个文件';
    }
    renderQueue();
  }

  async function convertItem(item, encoder) {
    item.state = 'decoding';
    item.progress = 8;
    item.message = '读取并解码音频…';
    updateRow(item);
    var buffer = await decodeFile(item.file);

    var channels = buffer.numberOfChannels === 1 ? 1 : 2;
    var sampleRate = pickSampleRate(buffer.sampleRate);
    item.state = 'encoding';
    item.progress = 30;
    item.message = '解码完成，准备编码…';
    updateRow(item);

    var pcm = await renderPcm(buffer, channels, sampleRate);
    var bitrate = getBitrate();
    var blob = await encodePcm(pcm, encoder, bitrate, function (progress) {
      item.progress = progress;
      item.message = '正在编码 ' + bitrate + ' kbps…';
      updateRow(item);
    });

    item.resultUrl = URL.createObjectURL(blob);
    item.state = 'done';
    item.progress = 100;
    item.message = '输出 ' + bitrate + ' kbps · ' + formatBytes(blob.size);
    updateRow(item);
  }

  async function convertAll() {
    if (busy || !queue.length) return;
    busy = true;
    if (convertButton) {
      convertButton.disabled = true;
      convertButton.textContent = '正在转换…';
    }
    if (clearButton) clearButton.disabled = true;
    if (statusEl) statusEl.textContent = '正在加载本地 MP3 编码器…';

    var encoder;
    try {
      encoder = await getEncoder();
    } catch (error) {
      busy = false;
      if (statusEl) statusEl.textContent = error.message || '编码器初始化失败';
      if (convertButton) {
        convertButton.disabled = false;
        convertButton.textContent = '开始转换 MP3';
      }
      renderQueue();
      return;
    }

    var pendingItems = queue.filter(function (entry) {
      return entry.state !== 'done' && !entry.blocked;
    });
    var done = 0;
    var failed = 0;

    for (var i = 0; i < pendingItems.length; i += 1) {
      var item = pendingItems[i];
      if (statusEl) statusEl.textContent = '正在处理 ' + (i + 1) + ' / ' + pendingItems.length + '：' + item.file.name;
      try {
        await convertItem(item, encoder);
        done += 1;
      } catch (error) {
        failed += 1;
        item.state = 'error';
        item.progress = 0;
        item.message = error && error.message ? error.message : '转换失败';
        updateRow(item);
      }
      await yieldToBrowser();
    }

    busy = false;
    if (convertButton) {
      convertButton.textContent = '开始转换 MP3';
    }
    if (statusEl) statusEl.textContent = '转换完成：成功 ' + done + ' 个' + (failed ? '，失败 ' + failed + ' 个' : '');
    renderQueue();
  }

  function clearQueue() {
    if (busy) return;
    queue.forEach(function (item) {
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    queue = [];
    if (input) input.value = '';
    if (statusEl) statusEl.textContent = '';
    renderQueue();
  }

  if (input) {
    function handleSelectedFiles() {
      var files = input.files;
      if (files && files.length) addFiles(files);
      input.value = '';
    }
    input.addEventListener('change', handleSelectedFiles);
    input.addEventListener('input', handleSelectedFiles);
  }

  if (dropZone) {
    ['dragenter', 'dragover'].forEach(function (eventName) {
      dropZone.addEventListener(eventName, function (event) {
        event.preventDefault();
        dropZone.classList.add('is-dragging');
      });
    });
    ['dragleave', 'drop'].forEach(function (eventName) {
      dropZone.addEventListener(eventName, function (event) {
        event.preventDefault();
        dropZone.classList.remove('is-dragging');
      });
    });
    dropZone.addEventListener('drop', function (event) {
      if (event.dataTransfer && event.dataTransfer.files) addFiles(event.dataTransfer.files);
    });
  }

  if (convertButton) convertButton.addEventListener('click', convertAll);
  if (clearButton) clearButton.addEventListener('click', clearQueue);
  renderQueue();
})();
