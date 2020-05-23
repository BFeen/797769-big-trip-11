import {destinations, offers, getAllTypes} from "./add-event-form.js";
import {getRandomArrayItem, getRandomInteger} from "../utils/common.js";

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random > 0.5 ? 1 : -1;
  const diffDays = getRandomInteger(0, 5) * sign;
  const diffHours = getRandomInteger(0, 24);
  const diffMinutes = getRandomInteger(0, 60);

  targetDate.setDate(targetDate.getDate() + diffDays);
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

  return {
    id: String(new Date().getMilliseconds() * Math.random()),
    type,
    destination: getRandomArrayItem(destinations),
    price,
    totalPrice,
    dateStart,
    dateEnd,
    selectedOffers,
    isFavorite: Math.random() > 0.5,
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent)
    .sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
};

export {generateEvent, generateEvents};
