/**
 * MacMP 在线 LUT 生成器
 * 纯前端：参考图色彩匹配 / 风格预设 → 导出 DaVinci Resolve 可用的 .cube 3D LUT
 */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  /* ---------- sRGB <-> Lab (D65) ---------- */
  const WHITE = [0.95047, 1.0, 1.08883];
  const M_RGB2XYZ = [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.072175],
    [0.0193339, 0.119192, 0.9503041],
  ];
  const M_XYZ2RGB = [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.969266, 1.8760108, 0.041556],
    [0.0556434, -0.2040259, 1.0572252],
  ];

  function srgbToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function linearToSrgb(c) {
    const v = c < 0 ? 0 : c;
    return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  }
  const labF = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const labFInv = (t) => {
    const t3 = t * t * t;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };

  function rgbToLab(r, g, b) {
    const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
    const x = M_RGB2XYZ[0][0] * lr + M_RGB2XYZ[0][1] * lg + M_RGB2XYZ[0][2] * lb;
    const y = M_RGB2XYZ[1][0] * lr + M_RGB2XYZ[1][1] * lg + M_RGB2XYZ[1][2] * lb;
    const z = M_RGB2XYZ[2][0] * lr + M_RGB2XYZ[2][1] * lg + M_RGB2XYZ[2][2] * lb;
    const fx = labF(x / WHITE[0]), fy = labF(y / WHITE[1]), fz = labF(z / WHITE[2]);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }

  function labToRgb(L, a, b) {
    const fy = (L + 16) / 116;
    const fx = fy + a / 500;
    const fz = fy - b / 200;
    const x = WHITE[0] * labFInv(fx);
    const y = WHITE[1] * labFInv(fy);
    const z = WHITE[2] * labFInv(fz);
    const lr = M_XYZ2RGB[0][0] * x + M_XYZ2RGB[0][1] * y + M_XYZ2RGB[0][2] * z;
    const lg = M_XYZ2RGB[1][0] * x + M_XYZ2RGB[1][1] * y + M_XYZ2RGB[1][2] * z;
    const lb = M_XYZ2RGB[2][0] * x + M_XYZ2RGB[2][1] * y + M_XYZ2RGB[2][2] * z;
    return [clamp01(linearToSrgb(lr)), clamp01(linearToSrgb(lg)), clamp01(linearToSrgb(lb))];
  }

  /* ---------- 图像分析 ---------- */
  function imageToCanvas(img, maxSide) {
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
    const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
    const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    return { canvas, ctx, data: ctx.getImageData(0, 0, w, h) };
  }

  // 统计 Lab 均值/标准差，忽略近黑近白像素，降低过曝高光对匹配的干扰
  function labStats(imageData) {
    const d = imageData.data;
    let n = 0;
    const sums = [0, 0, 0];
    const sqs = [0, 0, 0];
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
      const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (y < 0.02 || y > 0.985) continue;
      const lab = rgbToLab(r, g, b);
      for (let k = 0; k < 3; k++) {
        sums[k] += lab[k];
        sqs[k] += lab[k] * lab[k];
      }
      n++;
    }
    if (!n) return null;
    const mean = sums.map((s) => s / n);
    const std = sqs.map((s, k) => Math.sqrt(Math.max(1e-6, s / n - mean[k] * mean[k])));
    return { mean, std, count: n };
  }

  /* ---------- 变换 ---------- */
  function makeMatchTransform(src, ref, keepLuma) {
    const scale = [0, 1, 2].map((k) => ref.std[k] / Math.max(0.5, src.std[k]));
    // 限制对比拉伸幅度，避免极端参考图把画面拉爆
    for (let k = 0; k < 3; k++) scale[k] = Math.min(1.6, Math.max(0.62, scale[k]));
    return function (r, g, b) {
      const lab = rgbToLab(r, g, b);
      const outL = keepLuma ? lab[0] : (lab[0] - src.mean[0]) * scale[0] + ref.mean[0];
      const outA = (lab[1] - src.mean[1]) * scale[1] + ref.mean[1];
      const outB = (lab[2] - src.mean[2]) * scale[2] + ref.mean[2];
      return labToRgb(outL, outA, outB);
    };
  }

  function makePresetTransform(p) {
    return function (r, g, b) {
      let R = r * p.gain[0] + p.lift[0];
      let G = g * p.gain[1] + p.lift[1];
      let B = b * p.gain[2] + p.lift[2];

      R = (R - 0.5) * p.contrast + 0.5;
      G = (G - 0.5) * p.contrast + 0.5;
      B = (B - 0.5) * p.contrast + 0.5;

      const luma = 0.2126 * R + 0.7152 * G + 0.0722 * B;
      R = luma + (R - luma) * p.saturation;
      G = luma + (G - luma) * p.saturation;
      B = luma + (B - luma) * p.saturation;

      const l2 = 0.2126 * R + 0.7152 * G + 0.0722 * B;
      const shadowW = Math.max(0, 1 - l2 * 2);
      const highW = Math.max(0, l2 * 2 - 1);
      R += p.shadow[0] * shadowW + p.highlight[0] * highW;
      G += p.shadow[1] * shadowW + p.highlight[1] * highW;
      B += p.shadow[2] * shadowW + p.highlight[2] * highW;

      if (p.fade) {
        R = R * (1 - p.fade) + p.fade;
        G = G * (1 - p.fade) + p.fade;
        B = B * (1 - p.fade) + p.fade;
      }
      return [clamp01(R), clamp01(G), clamp01(B)];
    };
  }

  const PRESETS = [
    { id: 'none', name: '原味（不套预设）', desc: '只做参考图匹配或直接导出中性 LUT', contrast: 1, saturation: 1, lift: [0, 0, 0], gain: [1, 1, 1], shadow: [0, 0, 0], highlight: [0, 0, 0], fade: 0 },
    { id: 'warm-film', name: '暖调胶片', desc: '高光微暖、暗部略提，适合婚礼与纪实', contrast: 1.06, saturation: 0.96, lift: [0.012, 0.008, 0.002], gain: [1.03, 1.0, 0.965], shadow: [0.006, 0.002, -0.004], highlight: [0.014, 0.004, -0.012], fade: 0.012 },
    { id: 'teal-orange', name: '青橙商业', desc: '肤色偏暖、环境偏青，广告与预告片常用', contrast: 1.12, saturation: 1.04, lift: [-0.006, 0.004, 0.012], gain: [1.03, 1.0, 0.98], shadow: [-0.012, 0.004, 0.022], highlight: [0.022, 0.006, -0.014], fade: 0 },
    { id: 'cool-doc', name: '冷峻纪实', desc: '整体偏冷、反差稳，适合纪录片与采访', contrast: 1.05, saturation: 0.92, lift: [-0.002, 0.002, 0.01], gain: [0.975, 0.995, 1.03], shadow: [-0.008, 0, 0.014], highlight: [0, 0.002, 0.01], fade: 0.006 },
    { id: 'jp-clean', name: '日系清透', desc: '低反差、亮部柔、肤色干净', contrast: 0.93, saturation: 0.94, lift: [0.028, 0.03, 0.03], gain: [1.01, 1.005, 1.0], shadow: [0.004, 0.006, 0.008], highlight: [0.004, 0.004, 0.006], fade: 0.02 },
    { id: 'vintage-fade', name: '复古褪色', desc: '黑位抬高、饱和降低，胶片褪色感', contrast: 0.9, saturation: 0.86, lift: [0.05, 0.046, 0.042], gain: [0.97, 0.965, 0.96], shadow: [0.01, 0.008, 0.014], highlight: [0.006, 0.002, -0.004], fade: 0.045 },
    { id: 'hard-contrast', name: '硬朗高反差', desc: '强对比压暗部，宣传片与运动题材', contrast: 1.24, saturation: 0.98, lift: [-0.014, -0.012, -0.01], gain: [1.04, 1.035, 1.03], shadow: [-0.01, -0.006, 0.004], highlight: [0.008, 0.005, 0], fade: 0 },
    { id: 'soft-skin', name: '柔肤暖调', desc: '肤色偏暖略压绿，人像与访谈', contrast: 1.02, saturation: 0.98, lift: [0.014, 0.01, 0.006], gain: [1.028, 1.008, 0.99], shadow: [0.006, 0.002, 0], highlight: [0.016, 0.008, -0.004], fade: 0.01 },
    { id: 'wedding-bright', name: '婚礼明亮', desc: '通透提亮、白纱干净，婚礼短片常用', contrast: 1.03, saturation: 1.0, lift: [0.02, 0.019, 0.02], gain: [1.035, 1.025, 1.02], shadow: [0.004, 0.004, 0.006], highlight: [0.01, 0.008, 0.006], fade: 0.008 },
    { id: 'moody-blue', name: '夜色冷蓝', desc: '压暗整体、蓝调明显，夜景与情绪段落', contrast: 1.08, saturation: 0.94, lift: [-0.008, -0.004, 0.014], gain: [0.955, 0.975, 1.045], shadow: [-0.006, 0, 0.02], highlight: [-0.004, 0.002, 0.018], fade: 0.004 },
    { id: 'film-print', name: '胶片高光柔退', desc: '高光柔性递减、色彩收一点，接近印片观感', contrast: 1.05, saturation: 0.93, lift: [0.016, 0.014, 0.016], gain: [1.0, 0.99, 0.985], shadow: [0.004, 0.002, 0.008], highlight: [-0.03, -0.028, -0.022], fade: 0.018 },
    { id: 'bw', name: '黑白中性', desc: '完全去色，保留反差层次', contrast: 1.1, saturation: 0, lift: [0, 0, 0], gain: [1, 1, 1], shadow: [0, 0, 0], highlight: [0, 0, 0], fade: 0.01 },
  ];

  function presetById(id) {
    return PRESETS.find((p) => p.id === id) || PRESETS[0];
  }

  function composeTransforms(presetId, strength, matchFn) {
    const s = Math.min(1, Math.max(0, strength / 100));
    const presetFn = presetId && presetId !== 'none' ? makePresetTransform(presetById(presetId)) : null;
    return function (r, g, b) {
      let out = [r, g, b];
      if (matchFn) out = matchFn(out[0], out[1], out[2]);
      if (presetFn) out = presetFn(out[0], out[1], out[2]);
      if (!matchFn && !presetFn) return [r, g, b];
      return [
        clamp01(r + (out[0] - r) * s),
        clamp01(g + (out[1] - g) * s),
        clamp01(b + (out[2] - b) * s),
      ];
    };
  }

  /* ---------- 页面逻辑 ---------- */
  const state = {
    sourceImg: null,
    refImg: null,
    sourceData: null,
    refData: null,
    presetId: 'warm-film',
    strength: 70,
    size: 33,
    keepLuma: true,
    transform: null,
  };

  function readFileAsImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('没有选择文件'));
      if (!/^image\//.test(file.type) && !/\.(png|jpe?g|webp|tiff?|bmp)$/i.test(file.name)) {
        return reject(new Error('请选择图片文件（JPG / PNG / WebP）'));
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('图片读取失败')); };
      img.src = url;
    });
  }

  function setStatus(el, text, type = '') {
    if (!el) return;
    el.textContent = text;
    el.className = `lut-status${type ? ` ${type}` : ''}`;
  }

  function drawTo(canvas, imageData) {
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    canvas.getContext('2d').putImageData(imageData, 0, 0);
  }

  function renderPreview() {
    const beforeCanvas = $('#lutBefore');
    const afterCanvas = $('#lutAfter');
    const empty = $('#lutPreviewEmpty');
    if (!state.sourceData || !beforeCanvas || !afterCanvas) return;
    drawTo(beforeCanvas, state.sourceData);
    const src = state.sourceData;
    const out = new ImageData(new Uint8ClampedArray(src.data.length), src.width, src.height);
    const fn = state.transform || ((r, g, b) => [r, g, b]);
    for (let i = 0; i < src.data.length; i += 4) {
      const res = fn(src.data[i] / 255, src.data[i + 1] / 255, src.data[i + 2] / 255);
      out.data[i] = Math.round(res[0] * 255);
      out.data[i + 1] = Math.round(res[1] * 255);
      out.data[i + 2] = Math.round(res[2] * 255);
      out.data[i + 3] = src.data[i + 3];
    }
    drawTo(afterCanvas, out);
    if (empty) empty.hidden = true;
    beforeCanvas.hidden = false;
    afterCanvas.hidden = false;
  }

  function rebuildTransform() {
    const useMatch = $('#lutUseMatch')?.checked && state.sourceData && state.refData;
    let matchFn = null;
    if (useMatch) {
      const srcStats = labStats(state.sourceData);
      const refStats = labStats(state.refData);
      if (srcStats && refStats) matchFn = makeMatchTransform(srcStats, refStats, state.keepLuma);
    }
    state.transform = composeTransforms(state.presetId, state.strength, matchFn);
    const info = $('#lutMatchInfo');
    if (info) {
      info.textContent = useMatch
        ? `已启用参考图匹配（${state.keepLuma ? '保留原片亮度，仅迁移色彩倾向' : '同时迁移明暗与色彩'}）`
        : '未启用参考图匹配，当前只应用风格预设';
    }
  }

  function refresh() {
    rebuildTransform();
    renderPreview();
  }

  function buildCube(size, fn, title) {
    const lines = ['TITLE "' + title + '"', `LUT_3D_SIZE ${size}`, 'DOMAIN_MIN 0.0 0.0 0.0', 'DOMAIN_MAX 1.0 1.0 1.0'];
    const max = size - 1;
    for (let r = 0; r < size; r++) {
      for (let g = 0; g < size; g++) {
        for (let b = 0; b < size; b++) {
          const out = fn(r / max, g / max, b / max);
          lines.push(`${out[0].toFixed(6)} ${out[1].toFixed(6)} ${out[2].toFixed(6)}`);
        }
      }
    }
    return lines.join('\n') + '\n';
  }

  function downloadCube() {
    const status = $('#lutStatus');
    if (!state.transform) {
      setStatus(status, '请先上传原片截图。', 'error');
      return;
    }
    const size = Number($('#lutSize')?.value || state.size);
    const btn = $('#lutDownload');
    if (btn) btn.disabled = true;
    setStatus(status, `正在生成 ${size}³ LUT…`);
    setTimeout(() => {
      try {
        const preset = presetById(state.presetId);
        const nameInput = ($('#lutName')?.value || '').trim().replace(/[\\/:*?"<>|]/g, '');
        const title = `MacMP ${nameInput || preset.name} ${size}`.trim();
        const text = buildCube(size, state.transform, title);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(nameInput || 'macmp-lut').replace(/\s+/g, '-')}-${size}.cube`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        setStatus(status, `已导出 ${size}³（${size * size * size} 个采样点）LUT。`, 'success');
      } catch (error) {
        setStatus(status, error.message || '导出失败。', 'error');
      } finally {
        if (btn) btn.disabled = false;
      }
    }, 30);
  }

  function fillPresetSelect() {
    const select = $('#lutPreset');
    if (!select || select.dataset.ready) return;
    select.dataset.ready = '1';
    for (const preset of PRESETS) {
      const option = document.createElement('option');
      option.value = preset.id;
      option.textContent = preset.name;
      select.appendChild(option);
    }
    select.value = state.presetId;
  }

  function init() {
    if (!$('#lutTool')) return;
    fillPresetSelect();
    const status = $('#lutStatus');

    const sourceInput = $('#lutSourceInput');
    const refInput = $('#lutRefInput');

    sourceInput?.addEventListener('change', async (event) => {
      try {
        const img = await readFileAsImage(event.target.files?.[0]);
        state.sourceImg = img;
        state.sourceData = imageToCanvas(img, 720).data;
        setStatus(status, '原片已载入，可以调整风格强度。', 'success');
        refresh();
      } catch (error) {
        setStatus(status, error.message, 'error');
      }
    });

    refInput?.addEventListener('change', async (event) => {
      try {
        const img = await readFileAsImage(event.target.files?.[0]);
        state.refImg = img;
        state.refData = imageToCanvas(img, 480).data;
        const useMatch = $('#lutUseMatch');
        if (useMatch) useMatch.checked = true;
        setStatus(status, '参考图已载入，已自动开启参考图匹配。', 'success');
        refresh();
      } catch (error) {
        setStatus(status, error.message, 'error');
      }
    });

    $('#lutPreset')?.addEventListener('change', (event) => {
      state.presetId = event.target.value;
      const desc = $('#lutPresetDesc');
      if (desc) desc.textContent = presetById(state.presetId).desc;
      refresh();
    });

    $('#lutStrength')?.addEventListener('input', (event) => {
      state.strength = Number(event.target.value);
      const label = $('#lutStrengthValue');
      if (label) label.textContent = `${state.strength}%`;
      refresh();
    });

    $('#lutUseMatch')?.addEventListener('change', refresh);
    $('#lutKeepLuma')?.addEventListener('change', (event) => {
      state.keepLuma = event.target.checked;
      refresh();
    });
    $('#lutDownload')?.addEventListener('click', downloadCube);

    const desc = $('#lutPresetDesc');
    if (desc) desc.textContent = presetById(state.presetId).desc;
    const label = $('#lutStrengthValue');
    if (label) label.textContent = `${state.strength}%`;
    const select = $('#lutPreset');
    if (select) select.value = state.presetId;
    rebuildTransform();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
