export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  description?: string;
  location?: string;
  color?: string;
};

export type CalendarViewType = "month" | "week" | "day" | "agenda";
