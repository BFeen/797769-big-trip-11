import AbstractComponent from "./abstract-component.js";
import {eventType, destination, offers} from "../mock/add-event-form.js";
import {capitalizeFirstLetter, generateTime} from "../utils/common.js";


const createTypeSelectMarkup = () => {
  let markup = ``;

  for (const [key, values] of Object.entries(eventType)) {
    markup += `<fieldset class="event__type-group">
                <legend class="visually-hidden">${key}</legend> 
                ${values.map((item) => {
    return (
      `<div class="event__type-item">
        <input id="event-type-${item}-1" 
        class="event__type-input  visually-hidden" 
        type="radio" 
        name="event-type" 
        value="${item}">
        <label class="event__type-label  event__type-label--${item}" 
        for="event-type-${item}-1">
        ${capitalizeFirstLetter(item)}
        </label>
      </div>`
    );
  }).join(`\n`)}
    </fieldset>`;
  }

  return markup;
};

const createDestinationSelectMarkup = () => {
  return destination
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    });
};

const createOffersMarkup = (checkedOffer) => {
  return offers
    .map((offer) => {
      const {offerType, desc, price} = offer;
      let isChecked = desc === checkedOffer ? `checked` : ``;

      return (
        `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" 
            id="event-offer-${offerType}-1" 
            type="checkbox" 
            name="event-offer-${offerType}" 
            ${isChecked}>

            <label class="event__offer-label" 
            for="event-offer-${offerType}-1">
            <span class="event__offer-title">${desc}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
            </label>
        </div>`
      );
    }).join(`\n`);
};

export const createEditEventFormTemplate = (event) => {
  const {type, postfix, destination: eventDestination, price, timeStart, timeEnd, offerName, offerPrice} = event;

  const typeSelectMarkup = createTypeSelectMarkup();
  const destinationSelectMarkup = createDestinationSelectMarkup();
  const offersMarkup = createOffersMarkup(offerName);
  const totalPrice = price + offerPrice;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
          <header class="event__header">
          <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

              <div class="event__type-list">
              ${typeSelectMarkup}
              </div>

          </div>

          <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)} ${postfix}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" 
              type="text" name="event-destination" value="${eventDestination}" list="destination-list-1">
              <datalist id="destination-list-1">
              
              ${destinationSelectMarkup}

              </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">
              From
              </label>
              <input class="event__input  event__input--time" id="event-start-time-1" 
              type="text" name="event-start-time" value="18/03/2020 ${generateTime(timeStart)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">
              To
              </label>
              <input class="event__input  event__input--time" id="event-end-time-1" 
              type="text" name="event-end-time" value="21/03/2020 ${generateTime(timeEnd)}">
          </div>

          <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" 
              type="text" name="event-price" value="${totalPrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
          <label class="event__favorite-btn" for="event-favorite-1">
              <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
          </label>

          <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
          </button>
          </header>

          <section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
          ${offersMarkup}
              </div>
            </section>
        </section>
      </form>
    </li>`
  );
};

export default class EditFormComponent extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return createEditEventFormTemplate(this._event);
  }

  setCloseEditButtonClickHandler(handler) {
    const button = this.getElement().querySelector(`.event__rollup-btn`);
    button.addEventListener(`click`, handler);
  }
}
