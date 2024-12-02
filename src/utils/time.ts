const padCache = new Map<number, string>();

function padNumber(num: number): string {
  let padded = padCache.get(num);
  if (!padded) {
    padded = num.toString().padStart(2, "0");
    padCache.set(num, padded);
  }
  return padded;
}

export function formatTime(format: string): string {
  const date = new Date();
  const hours = padNumber(date.getHours());
  const minutes = padNumber(date.getMinutes());
  const seconds = padNumber(date.getSeconds());

  return format
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}
