const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
] as const;

function formatArDate(d: Date): string {
  return `${d.getDate()} ${AR_MONTHS[d.getMonth()]}`;
}

/** Honest UAE delivery window: today + minDays .. today + maxDays */
export function uaeDeliveryWindowLabel(minDays = 2, maxDays = 4, from = new Date()): string {
  const start = new Date(from);
  start.setDate(start.getDate() + minDays);
  const end = new Date(from);
  end.setDate(end.getDate() + maxDays);
  return `يوصلك بين ${formatArDate(start)} و${formatArDate(end)}`;
}
