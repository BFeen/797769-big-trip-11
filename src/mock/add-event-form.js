import {getRandomArrayItem, getRandomInteger} from "../utils/common.js";


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

const getPrepositionFromType = (type) => {
  return eventType.transfer.includes(type) ? `to` : `in`;
};

const getAllTypes = () => {
  return Object.values(eventType).reduce((acc, value) => acc.concat(...value));
};

const eventType = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`],
};

const offers = [
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

const availableOffers = new Map([
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

const destinations = [
  `Paris`, `Moscow`, `Berlin`, `Oslo`, `Amsterdam`, `Barcelona`, `Lissabon`, `Los Angeles`, `New York`, `London`
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

const generateDestination = (currentDestination) => {
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

export {eventType, destinations, offers, availableOffers, getAllTypes, generateDestination, getPrepositionFromType};
