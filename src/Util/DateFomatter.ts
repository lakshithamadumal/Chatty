export function formatChatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isToday = isSameDay(date, now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = isSameDay(date, yesterday);

  const timeStr = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `at Today ${timeStr}`; // at Today 7:15 PM
  if (isYesterday) return `at Yesterday ${timeStr}`; // at Yesterday 10:05 AM

  const monthShort = date.toLocaleString(undefined, { month: "short" }); // Sep
  const day = date.getDate(); // 25
  return `on ${monthShort} ${day} at ${timeStr}`; // on Sep 25 at 5:45 PM
}

export function formatChatListTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isToday = isSameDay(date, now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = isSameDay(date, yesterday);

  if (isToday) {
    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const ampm = hours24 < 12 ? "AM" : "PM";
    return `${hours12}.${minutes} ${ampm}`; // 11.03 AM
  }

  if (isYesterday) {
    return "Yesterday";
  }

  const m = date.getMonth() + 1; // 1-12
  const d = date.getDate(); // 1-31
  const yy = String(date.getFullYear()).slice(-2); // 25
  return `${m}/${d}/${yy}`; // 10/6/25
}
