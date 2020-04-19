const dateFormat = (value) => {
  return String(value).padStart(2, `0`);
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const generateTime = (date) => {
  const hours = dateFormat(date.getHours());
  const minutes = dateFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const generateDate = (date) => {
  const day = dateFormat(date.getDate());
  const month = dateFormat(date.getMonth());
  const year = dateFormat(date.getYear());

  return `${day}/${month}/${year}`;
};


const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length);

  return array[randomIndex];
};

export {capitalizeFirstLetter, generateTime, generateDate, getRandomInteger, getRandomArrayItem};
