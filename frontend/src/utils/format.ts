const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

/** Only http(s) URLs are safe to render as links. */
export function isSafeHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/** "linkedin.com/in/ada" from "https://www.linkedin.com/in/ada/". */
export function displayUrl(value: string): string {
  return value.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}
