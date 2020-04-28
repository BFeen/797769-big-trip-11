export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const dateFormat = (value) => {
  return String(value).padStart(2, `0`);
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateTime = (date) => {
  const hours = dateFormat(date.getHours());
  const minutes = dateFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const generateDate = (date) => {
  const day = dateFormat(date.getDate());
  const month = dateFormat(date.getMonth());
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};


export const getRandomInteger = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length);

  return array[randomIndex];
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
