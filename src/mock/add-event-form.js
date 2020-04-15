const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length);

  return array[randomIndex];
};

const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const generateRandomInfo = () => {
  let description = new Array();
  for (let i = 0; i < getRandomInteger(1,5); i++) {
    description.push(getRandomArrayItem(Info));
  }

  return description.join(' ');
};

export const pointType = {
  transfer: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  activity: [`check-in`, `sightseeing`, `restaurant`],
};

export const destination = [
  `Paris`, `Moscow`, `Berlin`, `Oslo`, `Amsterdam`, `Barcelona`, `Lissabon`, `Los Angeles`, `New York`, `London`
];

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

const Info = [
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

export const photoes = [
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`,
  `http://picsum.photos/248/152?r=${Math.random()}`
];
