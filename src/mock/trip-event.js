import {eventType, destination, offers, getAllTypes} from "./add-event-form.js";
import {getRandomArrayItem, getRandomInteger} from "../utils/common.js";


const countDurationTime = (startDate, endDate) => {
  const difference = endDate - startDate;

  const toMinutes = Math.floor(difference / (1000 * 60));

  const days = Math.floor(toMinutes / (60 * 24));
  const hours = Math.floor(toMinutes / 60) % 24;
  const minutes = toMinutes % 60;

  return `${days ? `${days}D ` : ``}${hours ? `${hours}H ` : ``}${minutes ? `${minutes}M` : ``}`;
};

const getRandomDate = (coefficient = false) => {
  const targetDate = new Date();
  const diffHours = getRandomInteger(0, 4) * coefficient;
  const diffMinutes = getRandomInteger(0, 60) * coefficient;

  targetDate.setHours(targetDate.getHours() + diffHours, targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

const generateEvent = () => {
  const selectedOffers = [];
  offers
    .forEach((offer) => {
      if (Math.random() > 0.5) {
        selectedOffers.push(offer);
      }
    });

  const dateStart = getRandomDate();
  const dateEnd = getRandomDate(true);

  const duration = countDurationTime(dateStart, dateEnd);

  const types = getAllTypes();
  const type = getRandomArrayItem(types);

  const price = getRandomInteger(0, 200);
  let totalPrice = price;
  for (const offer of selectedOffers) {
    totalPrice = totalPrice + offer.price;
  }

  return {
    type,
    postfix: eventType.transfer.includes(type) ? `to` : `in`,
    destination: getRandomArrayItem(destination),
    price,
    totalPrice,
    dateStart,
    dateEnd,
    duration,
    selectedOffers,
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvent, generateEvents};
