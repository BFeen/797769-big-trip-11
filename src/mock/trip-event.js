import {eventType, destination, offers, getAllTypes} from "./add-event-form.js";
import {getRandomArrayItem, getRandomInteger} from "../utils/common.js";


const countDurationTime = (startDate, endDate) => {
  const duration = new Date();
  duration.setTime(endDate - startDate);

  const hours = duration.getUTCHours();
  const minutes = duration.getUTCMinutes();
  return `
    ${hours ? `${hours}H` : ``} 
    ${minutes ? `${minutes}M` : ``}`;
};

const getRandomDate = () => {
  const targetDate = new Date();
  const diffHours = getRandomInteger(0, 4);
  const diffMinutes = getRandomInteger(0, 60);

  targetDate.setHours(targetDate.getHours() + diffHours, targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const generateEvent = () => {
  const {offerType, desc: offerName, price: offerPrice} = offers[getRandomInteger(0, offers.length)];
  const timeStart = getRandomDate();
  const timeEnd = getRandomDate();
  const duration = countDurationTime(timeStart, timeEnd);

  const types = getAllTypes();
  const type = getRandomArrayItem(types);

  return {
    type,
    postfix: eventType.transfer.includes(type) ? `to` : `in`,
    destination: getRandomArrayItem(destination),
    price: getRandomInteger(0, 200),
    timeStart,
    timeEnd,
    duration,
    offerType,
    offerName,
    offerPrice
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {countDurationTime, generateEvent, generateEvents};
