const UNITS: { seconds: number; singular: string }[] = [
  { seconds: 31536000, singular: "year" },
  { seconds: 2592000, singular: "month" },
  { seconds: 86400, singular: "day" },
  { seconds: 3600, singular: "hour" },
  { seconds: 60, singular: "minute" },
  { seconds: 1, singular: "second" },
];

export function humanizeSeconds(totalSeconds: number) {
  const seconds = Math.abs(Math.round(totalSeconds));

  for (const { seconds: unitSeconds, singular } of UNITS) {
    if (seconds >= unitSeconds) {
      const value = Math.floor(seconds / unitSeconds);
      return `${value} ${singular}${value === 1 ? "" : "s"}`;
    }
  }

  return "0 seconds";
}

export function PrettyDate({ date }: { date?: string }) {
  if (!date) return null;

  return <p>{prettyPrintDate(date)}</p>;
}

export function prettyPrintDate(
  date: string,
  { withDate = true }: { withDate?: boolean } = {},
) {
  const parsedDate = new Date(date);
  const ageSeconds = (Date.now() - parsedDate.getTime()) / 1000;
  return `${withDate ? parsedDate.toLocaleDateString() + " - " : ""}${humanizeSeconds(ageSeconds)} ago`;
}
