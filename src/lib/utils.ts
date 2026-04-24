import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DATE_RANGE_SEPARATOR = " - ";

type ParsedDate = {
  date: Date;
  hasDay: boolean;
};

function parseToDate(dateStr: string): ParsedDate | null {
  let year: number | null = null;
  let month: number | null = null;
  let day: number | null = null;
  let hasDay = false;

  if (dateStr.match(/^\d{4}-\d{2}$/)) {
    const parts = dateStr.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  } else if (dateStr.match(/^\d{4}-\d{2}-\d{1,2}$/)) {
    const parts = dateStr.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
    hasDay = true;
  } else if (dateStr.match(/^\d{4}\.\d{2}$/)) {
    const parts = dateStr.split(".");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  } else if (dateStr.match(/^\d{4}\.\d{2}\.\d{1,2}$/)) {
    const parts = dateStr.split(".");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
    hasDay = true;
  } else if (dateStr.match(/^\d{4}\/\d{2}$/)) {
    const parts = dateStr.split("/");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
  } else if (dateStr.match(/^\d{4}\/\d{2}\/\d{1,2}$/)) {
    const parts = dateStr.split("/");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
    hasDay = true;
  }

  if (year !== null && month !== null) {
      return {
          date: new Date(Date.UTC(year, month - 1, day ?? 1)),
          hasDay,
      };
  }
  return null;
}

export function formatDateString(dateStr: string | undefined, locale: string = "zh"): string {
  if (!dateStr) return "";

  if (dateStr.includes(DATE_RANGE_SEPARATOR)) {
    const [start, end] = dateStr.split(DATE_RANGE_SEPARATOR);
    return formatDateRange(start, end, locale);
  }

  const date = parseToDate(dateStr);
  if (!date) return dateStr;

  try {
      const year = date.date.getUTCFullYear();
      const month = String(date.date.getUTCMonth() + 1).padStart(2, "0");
      if (!date.hasDay) {
          return `${year}/${month}`;
      }
      const day = String(date.date.getUTCDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
  } catch (e) {
      return dateStr;
  }
}

export function formatDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  locale: string = "zh"
): string {
  const start = formatDateString(startDate, locale).trim();
  const end = formatDateString(endDate, locale).trim();

  return [start, end].filter(Boolean).join(DATE_RANGE_SEPARATOR);
}
