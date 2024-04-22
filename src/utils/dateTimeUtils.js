import { formatDistance } from "date-fns";

export function UTCtoLocalDate(string) {
  return new Date(string + "Z");
}

export function UTCtoLocalDateFormatted(date) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return new Date(date).toLocaleDateString("en-GB", options);
}

export function UTCtoLocalDateOnlyFormatted(date) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("en-GB", options);
}

export function getDateFrom(date) {
  const dateObj = new Date(date);
  return formatDistance(dateObj, new Date()).replace("about ", "");
}

export function getStringDateISO(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
