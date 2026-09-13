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

export function PrettyDate({ data }: { data?: string }) {
  if (!data) return null;
  const date = new Date(data);
  const ageSeconds = (Date.now() - date.getTime()) / 1000;

  return (
    <p>
      {date.toLocaleDateString()} - {humanizeSeconds(ageSeconds)} ago
    </p>
  );
}
