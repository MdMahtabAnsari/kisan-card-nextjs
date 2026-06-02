"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TimePickerInput } from "@/components/time-picker/time-picker-input";
import { WeekDay } from "@/generated/prisma/enums";
import { Label } from "@/components/ui/label";
import { TimePeriodSelect } from "@/components/time-picker/period-select";
import { Period } from "@/components/time-picker/time-picker-utils";
import { useState } from "react";

interface WorkingHourInputProps {
  days: WeekDay[];
  startTime: Date | undefined;
  endTime: Date | undefined;
  onStartTimeChange: (date: Date | undefined) => void;
  onEndTimeChange: (date: Date | undefined) => void;
  onDayChange: (day: WeekDay) => void;
}

export function WorkingHourInput({ days, startTime, endTime, onStartTimeChange, onEndTimeChange, onDayChange }: WorkingHourInputProps) {
  const [startPeriod, setStartPeriod] = useState<Period>("AM");
  const [endPeriod, setEndPeriod] = useState<Period>("AM");

  return (
    <Card>
      <CardContent>
        <Select onValueChange={(value) => onDayChange(value as WeekDay)} defaultValue={days[0]}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Days</SelectLabel>
              {
                days.map(day => {
                  return (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  )
                })
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-end gap-2">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Hours
            </Label>
            <TimePickerInput
              picker="12hours"
              period={startPeriod}
              date={startTime}
              setDate={onStartTimeChange}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              Minutes
            </Label>
            <TimePickerInput
              picker="minutes"
              id="minutes12"
              date={startTime}
              setDate={onStartTimeChange}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="period" className="text-xs">
              Period
            </Label>
            <TimePeriodSelect
              period={startPeriod}
              setPeriod={setStartPeriod}
              date={startTime}
              setDate={onStartTimeChange}
            />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Hours
            </Label>
            <TimePickerInput
              picker="12hours"
              period={endPeriod}
              date={endTime}
              setDate={onEndTimeChange}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              Minutes
            </Label>
            <TimePickerInput
              picker="minutes"
              id="minutes12"
              date={endTime}
              setDate={onEndTimeChange}
            />
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="period" className="text-xs">
              Period
            </Label>
            <TimePeriodSelect
              period={endPeriod}
              setPeriod={setEndPeriod}
              date={endTime}
              setDate={onEndTimeChange}
            />
          </div>
        </div>



      </CardContent>
    </Card>
  )
}
