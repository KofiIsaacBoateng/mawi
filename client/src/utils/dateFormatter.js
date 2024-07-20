import { addDays, format, isSameDay, isToday, startOfToday } from "date-fns";

export const formatDate = (date) => {
  const today = startOfToday();
  const nextWeekSameDay = addDays(today, 7);

  return isToday(date)
    ? "Today"
    : isSameDay(date, nextWeekSameDay)
    ? "Exactly a week from today"
    : `${format(date, "EEEE")}, ${format(date, "d, MMM yyyy")}`;
};

export const formatTime = (date) => {
  return format(date, "hh:mm aa");
};
