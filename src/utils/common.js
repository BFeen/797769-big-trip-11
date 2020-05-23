import moment from "moment";


export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatDay = (date) => {
  return moment(date).format(`MMM DD`);
};

export const getTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const getDate = (date) => {
  return moment(date).format(`DD/MM/YYYY`);
};

export const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length);

  return array[randomIndex];
};

export const countDurationTime = (startDate, endDate) => {
  const difference = moment.duration(endDate - startDate);

  const days = difference.days();
  const hours = difference.hours();
  const minutes = difference.minutes();

  return `${days ? `${days}D ` : ``}${hours ? `${hours}H ` : ``}${minutes ? `${minutes}M` : ``}`;
};

export const getFirstWordFromString = (string) => {
  return string.substring(0, string.indexOf(` `));
};
