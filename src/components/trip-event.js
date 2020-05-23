import AbstractComponent from "./abstract-component.js";
import {capitalizeFirstLetter, countDurationTime, getTime, getDate} from "../utils/common.js";
import {getPrepositionFromType} from "../mock/add-event-form.js";


const createSelectedOffersMarkup = (selectedOffers) => {
  if (selectedOffers.length > 3) {
    selectedOffers = selectedOffers.slice(0, 3);
  }
  return selectedOffers
    .map((offer) => {
      const {desc, price} = offer;
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${desc}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </li>`
      );
    }).join(`\n`);
};

const createTripEventTemplate = (event) => {
  const {type, destination, totalPrice, dateStart, dateEnd, selectedOffers} = event;

  const dayStart = getDate(dateStart);
  const timeStart = getTime(dateStart);
  const dayEnd = getDate(dateEnd);
  const timeEnd = getTime(dateEnd);
  const duration = countDurationTime(dateStart, dateEnd);
  const preposition = getPrepositionFromType(type);

  const selectedOffersMarkup = createSelectedOffersMarkup(selectedOffers);

  return (
    `<li class="trip-events__item">
        <div class="event">
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${preposition} ${destination}</h3>

        <div class="event__schedule">
            <p class="event__time">
            <time class="event__start-time" datetime="${dayStart}">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${dayEnd}">${timeEnd}</time>
            </p>
            <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${totalPrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
        </button>
        </div>
    </li>`
  );
};

export default class TripEventComponent extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    const button = this.getElement().querySelector(`.event__rollup-btn`);
    button.addEventListener(`click`, handler);
  }
}
