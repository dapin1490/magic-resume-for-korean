
import { DateInput } from "@heroui/date-input";
import { HeroUIProvider } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface UnifiedDateRangeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const SEPARATOR = " - ";
const PRESENT_VALUES = new Set(["Present", "Now", "至今"]);
const DATE_WITH_DAY_PATTERN = /^\d{4}[./-]\d{2}[./-]\d{1,2}$/;

const extractOptionalDay = (rawValue: string): string => {
  const normalizedValue = rawValue.trim().replace(/[.-]/g, "/");
  if (!DATE_WITH_DAY_PATTERN.test(normalizedValue.replace(/\//g, "-"))) {
    return "";
  }
  const dayToken = normalizedValue.split("/")[2];
  return dayToken || "";
};

const parsePart = (part: string): CalendarDate | null => {
  if (!part) return null;
  const cleanPart = part.trim();
  if (PRESENT_VALUES.has(cleanPart)) return null;

  try {
    let isoStr = cleanPart.replace(/[./]/g, "-");
    if (isoStr.length === 7) isoStr += "-01";
    const dayMatch = isoStr.match(/^(\d{4}-\d{2})-(\d{1,2})$/);
    if (dayMatch) {
      isoStr = `${dayMatch[1]}-${dayMatch[2].padStart(2, "0")}`;
    }
    if (isoStr.length === 4) isoStr += "-01-01";
    return parseDate(isoStr);
  } catch {
    return null;
  }
};

const parseRange = (rangeValue: string) => {
  if (!rangeValue) return { start: null, end: null };

  let startStr = "";
  let endStr = "";

  if (rangeValue.includes(SEPARATOR)) {
    [startStr, endStr] = rangeValue.split(SEPARATOR);
  } else {
    const match = rangeValue.match(/^([^\s]+)\s*(?:-|–|—)\s*([^\s]+)$/);
    if (match) {
      startStr = match[1];
      endStr = match[2];
    } else {
      startStr = rangeValue;
    }
  }

  return { start: parsePart(startStr), end: parsePart(endStr) };
};

export function UnifiedDateRangeInput({
  value,
  onChange,
  className,
}: UnifiedDateRangeInputProps) {
  const [range, setRange] = useState<{ start: CalendarDate | null; end: CalendarDate | null }>(
    () => parseRange(value)
  );
  const [optionalDays, setOptionalDays] = useState<{ start: string; end: string }>(() => {
    const [startRaw = "", endRaw = ""] = value.includes(SEPARATOR)
      ? value.split(SEPARATOR)
      : [value, ""];
    return { start: extractOptionalDay(startRaw), end: extractOptionalDay(endRaw) };
  });

  useEffect(() => {
    setRange(parseRange(value));
    const [startRaw = "", endRaw = ""] = value.includes(SEPARATOR)
      ? value.split(SEPARATOR)
      : [value, ""];
    setOptionalDays({ start: extractOptionalDay(startRaw), end: extractOptionalDay(endRaw) });
  }, [value]);

  const isPresent = PRESENT_VALUES.has(value.trim()) || value.endsWith(`${SEPARATOR}Present`) || value.endsWith(`${SEPARATOR}至今`);

  const updateValue = (
    newStart: CalendarDate | null,
    newEnd: CalendarDate | null
  ) => {
    const parsedStartDay = Number.parseInt(optionalDays.start, 10);
    const parsedEndDay = Number.parseInt(optionalDays.end, 10);
    const shouldIncludeStartDay = Number.isInteger(parsedStartDay) && parsedStartDay >= 1 && parsedStartDay <= 31;
    const shouldIncludeEndDay = Number.isInteger(parsedEndDay) && parsedEndDay >= 1 && parsedEndDay <= 31;

    const format = (dateValue: CalendarDate, includeDay: boolean, dayText: string) => {
      const year = dateValue.year;
      const month = dateValue.month.toString().padStart(2, "0");
      if (!includeDay) {
        return `${year}/${month}`;
      }
      const day = dayText;
      return `${year}/${month}/${day}`;
    };

    const startStr = newStart ? format(newStart, shouldIncludeStartDay, optionalDays.start) : "";
    const endStr = isPresent
      ? "Present"
      : (newEnd ? format(newEnd, shouldIncludeEndDay, optionalDays.end) : "");

    if (!startStr && !endStr) {
      onChange("");
      return;
    }

    if (startStr && !endStr) {
      onChange(startStr);
      return;
    }

    onChange(`${startStr}${SEPARATOR}${endStr}`);
  };

  const handleStartChange = (newStart: CalendarDate | null) => {
    setRange((prev) => {
      const next = { start: newStart, end: prev.end };
      updateValue(next.start, next.end);
      return next;
    });
  };

  const handleEndChange = (newEnd: CalendarDate | null) => {
    setRange((prev) => {
      const next = { start: prev.start, end: newEnd };
      updateValue(next.start, next.end);
      return next;
    });
  };

  const handleOptionalDayChange = (target: "start" | "end", rawDay: string) => {
    const dayOnlyText = rawDay.replace(/\D/g, "").slice(0, 2);
    setOptionalDays((previousDays) => ({ ...previousDays, [target]: dayOnlyText }));
    const parsedDay = Number.parseInt(dayOnlyText, 10);
    const isValidDay = Number.isInteger(parsedDay) && parsedDay >= 1 && parsedDay <= 31;
    if (target === "start" && range.start) {
      const shouldIncludeDay = dayOnlyText ? isValidDay : false;
      const monthValue = `${range.start.year}/${range.start.month.toString().padStart(2, "0")}`;
      const nextStartText = shouldIncludeDay ? `${monthValue}/${dayOnlyText.padStart(2, "0")}` : monthValue;
      const [currentStartValue = "", currentEndValue = ""] = value.includes(SEPARATOR)
        ? value.split(SEPARATOR)
        : [value, ""];
      const nextEndText = currentEndValue || (isPresent ? "Present" : "");
      if (!nextEndText) {
        onChange(nextStartText);
      } else {
        onChange(`${nextStartText}${SEPARATOR}${nextEndText}`);
      }
    }
    if (target === "end" && range.end && !isPresent) {
      const shouldIncludeDay = dayOnlyText ? isValidDay : false;
      const monthValue = `${range.end.year}/${range.end.month.toString().padStart(2, "0")}`;
      const nextEndText = shouldIncludeDay ? `${monthValue}/${dayOnlyText.padStart(2, "0")}` : monthValue;
      const [currentStartValue = "", currentEndValue = ""] = value.includes(SEPARATOR)
        ? value.split(SEPARATOR)
        : [value, ""];
      const nextStartText = currentStartValue;
      if (!nextStartText) {
        onChange(nextEndText);
      } else {
        onChange(`${nextStartText}${SEPARATOR}${nextEndText}`);
      }
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <HeroUIProvider locale="ja-JP">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <DateInput
                value={range.start}
                onChange={handleStartChange}
                variant="bordered"
                granularity={"month" as any}
                shouldForceLeadingZeros
                aria-label="Start Date"
                className="flex-1"
                classNames={{
                  inputWrapper:
                    "bg-background hover:bg-muted/20 h-9 min-h-0 py-0 px-3 shadow-sm ring-1 ring-inset ring-input border-0",
                  innerWrapper: "pb-0",
                }}
              />
              <Input
                value={optionalDays.start}
                onChange={(event) => handleOptionalDayChange("start", event.target.value)}
                placeholder="DD"
                inputMode="numeric"
                maxLength={2}
                disabled={!range.start}
                className="w-16"
                aria-label="Start day (optional)"
              />
            </div>
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="flex-1 relative">
            <div className="flex items-center gap-2">
              <DateInput
                value={isPresent ? null : range.end}
                onChange={handleEndChange}
                variant="bordered"
                granularity={"month" as any}
                shouldForceLeadingZeros
                aria-label="End Date"
                isDisabled={isPresent}
                className={cn("flex-1", isPresent && "opacity-50")}
                classNames={{
                  inputWrapper:
                    "bg-background hover:bg-muted/20 h-9 min-h-0 py-0 px-3 shadow-sm ring-1 ring-inset ring-input border-0",
                  innerWrapper: "pb-0",
                }}
              />
              <Input
                value={optionalDays.end}
                onChange={(event) => handleOptionalDayChange("end", event.target.value)}
                placeholder="DD"
                inputMode="numeric"
                maxLength={2}
                disabled={isPresent || !range.end}
                className="w-16"
                aria-label="End day (optional)"
              />
            </div>
          </div>
        </div>
      </HeroUIProvider>
    </div>
  );

}
