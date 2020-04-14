const generateRandomInfo = () => {
  let description = new Array();
  for (let i = 0; i < getRandomInteger(1,5); i++) {
    description.push(getRandomArrayItem(Info));
};

  return description.join(' ');
};

export const Type = [
    `Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeng`, `Reastaurant`
];

export const Destination = [
  `Paris`, `Moscow`, `Berlin`, `Oslo`, `Amsterdam`, `Barcelona`, `Lissabon`, `Los Angeles`, `New York`, `London`
];

export const Offers = [
  `Rent a car`, `Add luggage`, `Switch to comfort`, `Choose seat`, `Add breakfast`, `Book tickets`, `Lunch in city`
];

export const Info = [
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
