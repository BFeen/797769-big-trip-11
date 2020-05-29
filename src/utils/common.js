import {EventTypes} from "../const.js";
import moment from "moment";


const formatSimpleNum = (num) => {
  if (num === 0) {
    return;
  }
  return String(num).padStart(2,0);
}

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

export const getPrepositionFromType = (type) => {
  return EventTypes.TRANSFER.includes(type) ? `to` : `in`;
};

export const getFirstWord = (string) => {
  return string.substring(0, string.indexOf(` `));
};

export const createTotalPrice = (offers) => {
  let sum = 0;
  for (const offer of offers) {
    sum += offer.price;
  }
  return sum;
};

export const countDurationTime = (startDate, endDate) => {
  const difference = moment.duration(endDate - startDate);

  const days = formatSimpleNum(difference.days());
  const hours = formatSimpleNum(difference.hours());
  const minutes = formatSimpleNum(difference.minutes());

  return `${days ? `${days}D ` : ``}${hours ? `${hours}H ` : ``}${minutes ? `${minutes}M` : ``}`;
};

export const createOfferType = (offerTitle) => {
  return offerTitle.replace(/\s/ig, `-`).toLowerCase();
};
