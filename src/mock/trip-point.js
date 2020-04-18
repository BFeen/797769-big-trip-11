import {destination, offers, getRandomArrayItem, getRandomInteger} from "./add-event-form.js";


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

const generatePoint = () => {
  const {desc: offerName, price: offerPrice} = offers[getRandomInteger(0, offers.length)];
  const timeStart = getRandomDate();
  const timeEnd = getRandomDate();
  const duration = countDurationTime(timeStart, timeEnd);

  return {
    type: `taxi`,
    destination: getRandomArrayItem(destination),
    price: getRandomInteger(0, 200),
    timeStart,
    timeEnd,
    duration,
    offerName,
    offerPrice
  };
};

const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint);
};

export {countDurationTime, generatePoint, generatePoints};
