import { format, formatDistanceToNow, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

const locale = enUS;

export function formatDate(
  dateString: string,
  pattern = "MMM d, yyyy",
): string {
  return format(parseISO(dateString), pattern, { locale });
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), "MMM d, yyyy HH:mm", { locale });
}

export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}
