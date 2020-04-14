const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length);

  return array[randomIndex];
};

const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generatePoint = () => {
  return {
    type: `taxi`,
    destination: `Moscow`,
    price: `200`,
    timeStart: `17:30`,
    timeEnd: `19:05`,
    offer: `Rent a car`,
    offerPrice: `200`
  };
};

const generatePoints = (count) => {
  return new Array(count) 
    .fill(``)
    .map(generatePoint);
};

export {generatePoint, generatePoints};
