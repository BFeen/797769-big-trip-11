import {capitalizeFirstLetter, generateTime, createElement} from "../utils.js";


const createTripEventTemplate = (event) => {
  const {type, postfix, destination, price, timeStart, timeEnd, duration, offerName, offerPrice} = event;

  return (
    `<li class="trip-events__item">
        <div class="event">
        <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)} ${postfix} ${destination}</h3>

        <div class="event__schedule">
            <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T14:30">${generateTime(timeStart)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T16:05">${generateTime(timeEnd)}</time>
            </p>
            <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
            <li class="event__offer">
            <span class="event__offer-title">${offerName}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
            </li>
        </ul>

        <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
        </button>
        </div>
    </li>`
  );
};

export default class TripEventComponent {
  constructor(event) {
    this._event = event;  

    this._element = null;
  }

  getTemplate() {
    createTripEventTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
      this._element = null;
  }
}
