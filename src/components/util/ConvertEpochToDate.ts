import moment from "moment";

export const convertDate = (date: any) => {
  if (!date) return "";
  return moment(new Date(date)).format("dddd, MMMM DD, yyyy");
};

export const convertDateWithPattern = (date: any, pattern: any) => {
  if (!date || !pattern) return "";
  return moment(new Date(date)).format(pattern);
};

export const convertStringToEpoch = (date: string, sourcePattern: any, toPattern: any) => {
  if (!date) return "";
  const formatted = moment(date, sourcePattern).format(toPattern);
  return Number(formatted); 
};