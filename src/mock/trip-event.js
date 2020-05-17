import {eventType, destination, offers, getAllTypes} from "./add-event-form.js";
import {getRandomArrayItem, getRandomInteger} from "../utils/common.js";
import moment from "moment";


const countDurationTime = (startDate, endDate) => {
  const difference = moment.duration(endDate - startDate);

  const days = difference.days();
  const hours = difference.hours();
  const minutes = difference.minutes();

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

  const price = getRandomInteger(0, 200);
  const selectedOffers = generateRandomOffers();
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
