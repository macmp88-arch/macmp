export function orderReference() {
  const now = new Date();
  const date = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}`;
  const random = crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase();
  return `MP-${date}-${random}`;
}

export function numeric(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
