
import { DateInput } from "@heroui/date-input";
import { HeroUIProvider } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface UnifiedDateInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
}

const DATE_WITH_DAY_PATTERN = /^\d{4}[./-]\d{2}[./-]\d{1,2}$/;
const MIN_DAY_VALUE = 1;
const MAX_DAY_VALUE = 31;
const DAY_DIGIT_LENGTH = 2;

export function UnifiedDateInput({
  value,
  onChange,
  label,
  isRequired,
  className,
}: UnifiedDateInputProps) {
  const extractOptionalDay = (input: string): string => {
    const normalizedInput = input.trim().replace(/[.-]/g, "/");
    if (!DATE_WITH_DAY_PATTERN.test(normalizedInput.replace(/\//g, "-"))) {
      return "";
    }
    const dayToken = normalizedInput.split("/")[2];
    return dayToken || "";
  };

  const parseValue = (input: string): CalendarDate | null => {
    if (!input) return null;
    try {
      let normalized = input.replace(/[./]/g, "-");
      if (normalized.length === 7) normalized = `${normalized}-01`;
      const dayMatch = normalized.match(/^(\d{4}-\d{2})-(\d{1,2})$/);
      if (dayMatch) {
        normalized = `${dayMatch[1]}-${dayMatch[2].padStart(2, "0")}`;
      }
      return parseDate(normalized);
    } catch {
      return null;
    }
  };

  const formatCalendarDate = (
    date: CalendarDate,
    includeDay: boolean,
    dayText?: string,
    shouldPadDay = true
  ): string => {
    const year = date.year;
    const month = date.month.toString().padStart(2, "0");
    if (!includeDay) {
      return `${year}/${month}`;
    }
    const rawDayText = dayText ?? date.day.toString();
    const day = shouldPadDay ? rawDayText.padStart(DAY_DIGIT_LENGTH, "0") : rawDayText;
    return `${year}/${month}/${day}`;
  };

  const isPresent =
    value === "Present" ||
    value === "Now" ||
    value === "至今" ||
    value.includes("Present") ||
    value.includes("Now") ||
    value.includes("至今");

  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(() =>
    parseValue(value)
  );
  const [optionalDay, setOptionalDay] = useState<string>(() => extractOptionalDay(value));

  useEffect(() => {
    setSelectedDate(parseValue(value));
    setOptionalDay(extractOptionalDay(value));
  }, [value]);

  const buildOutputValue = (date: CalendarDate, dayText: string) => {
    const parsedDay = Number.parseInt(dayText, 10);
    const shouldIncludeDay =
      Number.isInteger(parsedDay) &&
      parsedDay >= MIN_DAY_VALUE &&
      parsedDay <= MAX_DAY_VALUE;
    onChange(formatCalendarDate(date, shouldIncludeDay, dayText, false));
  };

  const handleDateChange = (date: CalendarDate | null) => {
    setSelectedDate(date);
    if (!date) {
      setOptionalDay("");
      onChange("");
      return;
    }
    buildOutputValue(date, optionalDay);
  };

  const handleOptionalDayChange = (rawDay: string) => {
    const dayOnlyText = rawDay.replace(/\D/g, "").slice(0, 2);
    setOptionalDay(dayOnlyText);
    if (!selectedDate) return;
    if (!dayOnlyText) {
      onChange(formatCalendarDate(selectedDate, false));
      return;
    }
    const parsedDay = Number.parseInt(dayOnlyText, 10);
    if (
      Number.isInteger(parsedDay) &&
      parsedDay >= MIN_DAY_VALUE &&
      parsedDay <= MAX_DAY_VALUE
    ) {
      onChange(formatCalendarDate(selectedDate, true, dayOnlyText, false));
    }
  };

  const handleOptionalDayBlur = () => {
    if (!selectedDate || !optionalDay) return;
    const parsedDay = Number.parseInt(optionalDay, 10);
    const isValidDay =
      Number.isInteger(parsedDay) &&
      parsedDay >= MIN_DAY_VALUE &&
      parsedDay <= MAX_DAY_VALUE;
    if (!isValidDay) return;
    const paddedDayText = optionalDay.padStart(DAY_DIGIT_LENGTH, "0");
    if (paddedDayText !== optionalDay) {
      setOptionalDay(paddedDayText);
    }
    onChange(formatCalendarDate(selectedDate, true, paddedDayText, true));
  };

  return (
    <div className={className}>
      <HeroUIProvider locale="ja-JP">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <DateInput
              value={isPresent ? null : selectedDate}
              onChange={handleDateChange}
              isRequired={isRequired}
              granularity={"month" as any}
              variant="bordered"
              labelPlacement="outside"
              shouldForceLeadingZeros
              isDisabled={isPresent}
              className={cn(isPresent && "opacity-50")}
              classNames={{
                inputWrapper:
                  "shadow-sm hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-background",
              }}
            />
          </div>
          <Input
            value={optionalDay}
            onChange={(event) => handleOptionalDayChange(event.target.value)}
            onBlur={handleOptionalDayBlur}
            placeholder="DD"
            inputMode="numeric"
            maxLength={2}
            disabled={isPresent || !selectedDate}
            className="w-16"
            aria-label="Day (optional)"
          />
        </div>
      </HeroUIProvider>
    </div>
  );
}
