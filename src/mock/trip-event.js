import {getRandomArrayItem, getRandomInteger} from "../utils/common.js";
import {EventTypes, Offers, Destinations, InfoSentences} from "../const.js";


const getAllTypes = () => {
  return Object.values(EventTypes).reduce((acc, value) => acc.concat(value));
};

const generateRandomInfo = () => {
  let description = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    description.push(getRandomArrayItem(InfoSentences));
  }

  return description.join(` `);
};

const generateRandomPhotos = () => {
  let photos = [];
  for (let i = 0; i < 4; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return photos;
};

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
  Offers
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
    destination: getRandomArrayItem(Destinations),
    price,
    totalPrice,
    dateStart,
    dateEnd,
    selectedOffers,
    isFavorite: Math.random() > 0.5,
  };
};

export const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent)
    .sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime());
};

export const generateDestination = (currentDestination) => {
  let description = ``;
  if (currentDestination) {
    description = Math.random() > 0.5 ? generateRandomInfo() : ``;
  }

  return {
    name: currentDestination,
    description,
    pictures: description ? generateRandomPhotos() : ``,
  };
};
