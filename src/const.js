export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const EventTypes = {
  TRANSFER: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  ACTIVITY: [`check-in`, `sightseeing`, `restaurant`],
};

export const Offers = [
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

export const Destinations = [
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

export const InfoSentences = [
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

