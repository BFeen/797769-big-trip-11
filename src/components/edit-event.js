import AbstractSmartComponent from "./abstract-smart-component.js";
import {eventType, destination, offers} from "../mock/add-event-form.js";
import {capitalizeFirstLetter, getTime, getDate} from "../utils/common.js";
import flatpicr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";


const createTypeSelectMarkup = (currentType = `flight`) => {
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
        for="event-type-${item}-1" ${currentType === item ? `checked` : ``}>${capitalizeFirstLetter(item)}</label>
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
    }).join(`\n`);
};

const createOffersMarkup = (selectedOffers) => {
  let isChecked;

  return offers
    .map((offer) => {
      const {type, desc, price} = offer;
      isChecked = ``;

      for (const element of selectedOffers) {
        if (element.desc === desc) {
          isChecked = `checked`;
          break;
        }
      }

      return (
        `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" 
            id="event-offer-${type}-1" 
            type="checkbox" 
            name="event-offer-${type}" 
            ${isChecked}>

            <label class="event__offer-label" 
            for="event-offer-${type}-1">
            <span class="event__offer-title">${desc}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
            </label>
        </div>`
      );
    }).join(`\n`);
};

export const createEditEventFormTemplate = (event) => {
  const {type, postfix, destination: eventDestination, price, dateStart, dateEnd, selectedOffers, isFavorite} = event;

  const dayStart = getDate(dateStart);
  const timeStart = getTime(dateStart);
  const dayEnd = getDate(dateEnd);
  const timeEnd = getTime(dateEnd);

  const typeSelectMarkup = createTypeSelectMarkup(type);
  const destinationSelectMarkup = createDestinationSelectMarkup();
  const offersMarkup = createOffersMarkup(selectedOffers);
  const isChecked = isFavorite ? `checked` : ``;

  return (
    `<form class="event  event--edit" action="#" method="post">
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
            type="text" name="event-start-time" value="${dayStart} ${timeStart}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
            To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" 
            type="text" name="event-end-time" value="${dayEnd} ${timeEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" 
            type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" 
        class="event__favorite-checkbox  visually-hidden" 
        type="checkbox" 
        name="event-favorite" 
        ${isChecked}
        >
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
    </form>`
  );
};

const isSelectedOffer = (selectedOffers, currentOffer) => {
  return selectedOffers.some((offer) => offer.desc === currentOffer);
};

const getOfferIndex = (allOffers, currentOffer) => {
  return allOffers.findIndex((item) => item.desc === currentOffer);
};

export default class EditFormComponent extends AbstractSmartComponent {
  constructor(event) {
    super();

    this._event = event;

    this._offers = offers;
    this._flatpicr = null;

    this._closeHandler = null;
    this._deleteHandler = null;
    this._favoriteHandler = null;
    this._submitHandler = null;

    this._applyFlatpicr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventFormTemplate(this._event);
  }

  rerender() {
    super.rerender();

    this._applyFlatpicr();
  }

  reset() {
    // this._event.destination = event.destination;
    // this._event.selectedOffers = event.selectedOffers;
    // возвращать исходное состояние формы
    this.rerender();
  }

  recoveryListeners() {
    this.setCloseEditButtonClickHandler(this._closeHandler);
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  setCloseEditButtonClickHandler(handler) {
    this._closeHandler = handler;
    const button = this.getElement().querySelector(`.event__rollup-btn`);
    button.addEventListener(`click`, handler);
  }

  setDeleteButtonClickHandler(handler) {
    this._deleteHandler = handler;
    const deleteButton = this.getElement().querySelector(`.event__reset-btn`);
    deleteButton.addEventListener(`click`, handler);
  }

  setSubmitHandler(handler) {
    this._submitHandler = handler;
    this.getElement().addEventListener(`submit`, handler);
  }

  _applyFlatpicr() {
    if (this._flatpicr) {
      this._flatpicr.destroy();
      this._flatpicr = null;
    }

    const dateStartElement = this.getElement().querySelector(`#event-start-time-1`);
    this._flatpicr = flatpicr(dateStartElement, {
      altFormat: `d/m/y H:i`,
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._event.dateStart || `today`,
    });

    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);
    this._flatpicr = flatpicr(dateEndElement, {
      altFormat: `d/m/y H:i`,
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._event.dateEnd || `today`,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    // подписка на событие "выбор даты"
    const eventTypeElements = element.querySelectorAll(`.event__type-label`);
    eventTypeElements.forEach((item) => {
      item.addEventListener(`click`, () => {
        const selectedType = item.textContent.toLowerCase();

        this._event.type = selectedType;
        this._event.postfix = eventType.transfer.includes(selectedType) ? `to` : `in`;
        // моментальное изменение офферов в связи с изменением типа поездки

        this.rerender();
      });
    });

    const destinationElement = element.querySelector(`.event__input--destination`);
    destinationElement.addEventListener(`change`, () => {
      this._event.destination = destinationElement.value;
      // изменение описания города

      this.rerender();
    });

    const offersElements = element.querySelectorAll(`.event__offer-label`);
    offersElements.forEach((offer) => {
      offer.addEventListener(`click`, () => {
        const offerDesc = offer.querySelector(`span`).textContent;
        let selectedOffers = this._event.selectedOffers.slice();

        if (isSelectedOffer(selectedOffers, offerDesc)) {
          const index = getOfferIndex(selectedOffers, offerDesc);
          this._event.selectedOffers = [].concat(selectedOffers.slice(0, index), selectedOffers.slice(index + 1));
        } else {
          const index = getOfferIndex(this._offers, offerDesc);
          this._event.selectedOffers.push(this._offers[index]);
        }

        this.rerender();
      });
    });

    const favoriteElement = element.querySelector(`.event__favorite-btn`);
    favoriteElement.addEventListener(`click`, () => {
      this._event.isFavorite = !this._event.isFavorite;

      this.rerender();
    });
  }
}
