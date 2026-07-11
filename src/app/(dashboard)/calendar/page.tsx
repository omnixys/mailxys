"use client";

import {
  CalendarMonthRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
  TodayRounded,
} from "@mui/icons-material";
import { alpha, Box, Button, Chip, Typography, useTheme } from "@mui/material";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";
import { mockCalendarEvents } from "@/features/calendar/constants/mockData";
import type {
  CalendarEvent,
  CalendarViewType,
} from "@/features/calendar/types";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const VIEW_TABS: { label: string; value: CalendarViewType }[] = [
  { label: "Month", value: "month" },
  { label: "Week", value: "week" },
  { label: "Day", value: "day" },
  { label: "Agenda", value: "agenda" },
];

function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter((event) => {
    const eventStart = parseISO(event.start);
    const eventEnd = parseISO(event.end);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    return eventStart <= dayEnd && eventEnd >= dayStart;
  });
}

function formatEventTime(iso: string): string {
  return format(parseISO(iso), "h:mm a");
}

export default function CalendarPage() {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(
    new Date(2026, 6, 1),
  );
  const [activeView, setActiveView] = useState<CalendarViewType>("month");

  const today = new Date(2026, 6, 11);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const selectedDayEvents = selectedDay
    ? getEventsForDay(mockCalendarEvents, selectedDay)
    : [];

  const goToPrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const goToToday = () => {
    setCurrentDate(new Date(2026, 6, 1));
    setSelectedDay(new Date(2026, 6, 1));
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%" }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            <CalendarMonthRounded sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Calendar
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25 }}
            >
              Manage your schedule and events
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          {VIEW_TABS.map((tab) => (
            <Chip
              key={tab.value}
              label={tab.label}
              onClick={() => setActiveView(tab.value)}
              variant={activeView === tab.value ? "filled" : "outlined"}
              sx={{
                fontWeight: 600,
                fontSize: "0.8125rem",
                bgcolor:
                  activeView === tab.value ? "primary.main" : "transparent",
                color:
                  activeView === tab.value
                    ? "primary.contrastText"
                    : "text.secondary",
                borderColor: alpha(theme.palette.divider, 0.6),
                "&:hover": {
                  bgcolor:
                    activeView === tab.value
                      ? "primary.main"
                      : alpha(theme.palette.action.active, 0.06),
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, flex: 1 }}>
        {/* Calendar Grid */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Month Nav */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {format(currentDate, "MMMM yyyy")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<TodayRounded />}
                onClick={goToToday}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: alpha(theme.palette.divider, 0.6),
                }}
              >
                Today
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={goToPrevMonth}
                sx={{ minWidth: 36, p: 0.5 }}
              >
                <ChevronLeftRounded />
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={goToNextMonth}
                sx={{ minWidth: 36, p: 0.5 }}
              >
                <ChevronRightRounded />
              </Button>
            </Box>
          </Box>

          {/* Weekday Headers */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              mb: 0.5,
            }}
          >
            {WEEKDAY_LABELS.map((day) => (
              <Box
                key={day}
                sx={{
                  py: 1,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Day Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(mockCalendarEvents, day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, today);
              const isSelected = selectedDay
                ? isSameDay(day, selectedDay)
                : false;

              return (
                <Box
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  sx={{
                    minHeight: 90,
                    p: 1,
                    cursor: "pointer",
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent",
                    borderRight: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                    opacity: isCurrentMonth ? 1 : 0.35,
                    transition: "background-color 150ms ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.action.active, 0.05),
                    },
                    "&:nth-of-type(7n)": {
                      borderRight: "none",
                    },
                    "&:nth-last-of-type(-n+7)": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isToday ? "primary.main" : "transparent",
                        color: isToday
                          ? "primary.contrastText"
                          : "text.primary",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: isToday ? 700 : 500,
                          fontSize: "0.8125rem",
                        }}
                      >
                        {format(day, "d")}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.25,
                      alignItems: "center",
                    }}
                  >
                    {dayEvents.slice(0, 3).map((event) => (
                      <Box
                        key={event.id}
                        sx={{
                          width: "100%",
                          height: 5,
                          borderRadius: 3,
                          bgcolor: event.color ?? theme.palette.primary.main,
                          opacity: 0.85,
                        }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.6rem",
                          color: "text.secondary",
                          fontWeight: 600,
                        }}
                      >
                        +{dayEvents.length - 3} more
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Sidebar – Selected Day Events */}
        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
            borderRadius: 2,
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            alignSelf: "flex-start",
            position: "sticky",
            top: 24,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25 }}>
            {selectedDay ? format(selectedDay, "EEEE, MMM d") : "Select a day"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            {selectedDayEvents.length === 0
              ? "No events"
              : `${selectedDayEvents.length} event${selectedDayEvents.length !== 1 ? "s" : ""}`}
          </Typography>

          {selectedDayEvents.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                py: 4,
              }}
            >
              <CalendarMonthRounded
                sx={{ fontSize: 48, color: "text.secondary", opacity: 0.25 }}
              />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {selectedDayEvents.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    borderLeft: `3px solid ${event.color ?? theme.palette.primary.main}`,
                    bgcolor: alpha(
                      event.color ?? theme.palette.primary.main,
                      0.06,
                    ),
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {event.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.25, display: "block" }}
                  >
                    {event.allDay
                      ? "All day"
                      : `${formatEventTime(event.start)} – ${formatEventTime(event.end)}`}
                  </Typography>
                  {event.location && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.25 }}
                    >
                      {event.location}
                    </Typography>
                  )}
                  {event.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        fontStyle: "italic",
                        opacity: 0.8,
                      }}
                    >
                      {event.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
