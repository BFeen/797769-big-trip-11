import {EventTypes} from "../const.js";
import moment from "moment";


const formatSimpleNum = (num) => {
  if (num === 0) {
    return ``;
  }
  return String(num).padStart(2, 0);
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const countDurationTime = (startDate, endDate) => {
  const difference = moment.duration(endDate - startDate);

  const days = formatSimpleNum(difference.days());
  const hours = formatSimpleNum(difference.hours());
  const minutes = formatSimpleNum(difference.minutes());

  return `${days ? `${days}D ` : ``}${hours ? `${hours}H ` : ``}${minutes ? `${minutes}M` : ``}`;
};

const createOfferType = (offerTitle) => {
  return offerTitle.replace(/\s/ig, `-`).toLowerCase();
};

const formatDay = (date) => {
  return moment(date).format(`MMM DD`);
};

const getTime = (date) => {
  return moment(date).format(`HH:mm`);
};

const getDate = (date) => {
  return moment(date).format(`DD/MM/YYYY`);
};

const getPrepositionFromType = (type) => {
  return EventTypes.TRANSFER.includes(type) ? `to` : `in`;
};

const createTotalPrice = (offers) => {
  let sum = 0;
  for (const offer of offers) {
    sum += offer.price;
  }
  return sum;
};

export {
  capitalizeFirstLetter, 
  countDurationTime, 
  createOfferType, 
  formatDay, 
  getTime, 
  getDate, 
  getPrepositionFromType, 
  createTotalPrice
};
