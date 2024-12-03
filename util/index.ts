export function formatDateToPST(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}
