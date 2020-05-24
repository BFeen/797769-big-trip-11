import {getRandomArrayItem, getRandomInteger} from "../utils/common.js";


const getAllTypes = () => {
  return Object.values(eventType).reduce((acc, value) => acc.concat(value));
};

const generateRandomInfo = () => {
  let description = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    description.push(getRandomArrayItem(info));
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

export const getPrepositionFromType = (type) => {
  return eventType.transfer.includes(type) ? `to` : `in`;
};

export const eventType = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`],
};

export const offers = [
  {
    type: `luggage`,
    desc: `Add luggage`,
    price: 30
  }, {
    type: `car`,
    desc: `Rent a car`,
    price: 200
  }, {
    type: `breakfast`,
    desc: `Add breakfast`,
    price: 10
  }, {
    type: `comfort`,
    desc: `Switch to comfort`,
    price: 100
  }, {
    type: `lunch`,
    desc: `Lunch in city`,
    price: 25
  }
];

export const availableOffers = new Map([
  [
    `train`, [`comfort`]
  ], [
    `ship`, [`comfort`, `luggage`]
  ], [
    `flight`, [`car`, `comfort`, `luggage`]
  ], [
    `check-in`, [`breakfast`]
  ], [
    `sightseeing`, [`lunch`]
  ]
]);

export const destinations = [
  `Paris`,
  `Moscow`,
  `Berlin`,
  `Oslo`,
  `Amsterdam`,
  `Barcelona`,
  `Lissabon`,
  `Los Angeles`,
  `New York`,
  `London`,
];

const info = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
