const PointType = [
  `Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeng`, `Reastaurant`
];

const Destination = [
  `Paris`, `Moscow`, `Berlin`, `Oslo`, `Amsterdam`, `Barcelona`, `Lissabon`, `Los Angeles`, `New York`, `London`
];

const Info = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
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

// const offers = [?] Зависит от типа поездки

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length);

  return array[randomIndex];
};

const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generateRandomInfo = () => {
  let sum = ``;
  for (let i = 0; i < getRandomInteger(1,5); i++) {
    sum += getRandomArrayItem(Info);
  };

  return sum;
};

const generatePoint = () => {
  return {
    type: getRandomArrayItem(PointType),
    destination: getRandomArrayItem(Destination),
    info: generateRandomInfo(),
    photo: `http://picsum.photos/248/152?r=${Math.random()}`,
    price: getRandomInteger(20, 200),
  };
};

const generatePoints = (count) => {
  return new Array(count) 
    .fill(``)
    .map(generatePoint);
};

export {generatePoint, generatePoints};
