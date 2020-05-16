import {eventType, destination, offers, getAllTypes} from "./add-event-form.js";
import {getRandomArrayItem, getRandomInteger} from "../utils/common.js";


const countDurationTime = (startDate, endDate) => {
  const difference = endDate - startDate;

  const toMinutes = Math.floor(difference / (1000 * 60));

  const days = Math.floor(toMinutes / (60 * 24));
  const hours = Math.floor(toMinutes / 60) % 24;
  const minutes = toMinutes % 60;

  return `${days ? `${days}D ` : ``}${hours ? `${hours}H ` : ``}${minutes ? `${minutes}M` : ``}`;
};

const getRandomDate = () => {
  const targetDate = new Date();
  const diffHours = getRandomInteger(0, 24);
  const diffMinutes = getRandomInteger(0, 60);

  targetDate.setHours(targetDate.getHours() + diffHours, targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const generateRandomOffers = () => {
  const selectedOffers = [];
  offers
    .forEach((offer) => {
      if (Math.random() > 0.5) {
        selectedOffers.push(offer);
      }
    });
  return selectedOffers;
};

const generateEvent = () => {
  const types = getAllTypes();
  const type = getRandomArrayItem(types);

  
  const selectedOffers = generateRandomOffers();
  const price = getRandomInteger(0, 200);
  let totalPrice = price;
  selectedOffers.forEach((offer) => {
    totalPrice = totalPrice + offer.price;
  });
  
  const dateStart = getRandomDate();
  const dateEnd = new Date(dateStart.getTime() + getRandomInteger(100000, 172800000));
  const duration = countDurationTime(dateStart, dateEnd);
  

  return {
    type,
    postfix: eventType.transfer.includes(type) ? `to` : `in`,
    destination: getRandomArrayItem(destination),
    price,
    totalPrice,
    dateStart,
    dateEnd,
    duration,
    selectedOffers,
    isFavorite: Math.random() > 0.5,
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents};
