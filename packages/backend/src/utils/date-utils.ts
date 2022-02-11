import { format } from "date-fns";

export const formatDayMonthYear = (date: Date | number) =>
  format(date, "dd-MM-yyyy");
