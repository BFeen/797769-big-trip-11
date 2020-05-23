import AbstractSmartComponent from "./abstract-smart-component.js";
import {eventType, destinations, offers, generateDestination, getPrepositionFromType} from "../mock/add-event-form.js";
import {capitalizeFirstLetter, getTime, getDate} from "../utils/common.js";
import {Mode} from "../controllers/event-controller.js";
import {encode} from "he";
import flatpicr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const createRollupButtonMarkup = (mode) => {
  if (mode === Mode.ADDING) {
    return ``;
  }

  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const createDeleteButtonMarkup = (mode) => {
  const buttonText = mode === Mode.ADDING ? `Cancel` : `Delete`;

  return `<button class="event__reset-btn" type="reset">${buttonText}</button>`;
};

const createFavoriteButtonMarkup = (isFavorite, mode) => {
  if (mode === Mode.ADDING) {
    return ``;
  }

  const isChecked = isFavorite ? `checked` : ``;

  return (
    `<input 
    id="event-favorite-1" 
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
    </label>`
  );
};

const createSaveButtonMarkup = () => {
  return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>`;
};

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
        value="${item}" 
        ${currentType === item ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${item}" 
        for="event-type-${item}-1" >${capitalizeFirstLetter(item)}</label>
      </div>`
    );
  }).join(`\n`)}
    </fieldset>`;
  }

  return markup;
};

const createDestinationSelectMarkup = () => {
  return destinations
    .map((city) => {
      return (
        `<option value="${city}"></option>`
      );
    }).join(`\n`);
};

const createDetailsContainerMarkup = (offersMarkup, descriptionMarkup) => {
  if (offersMarkup || descriptionMarkup) {
    return (
      `<section class="event__details">
      ${offersMarkup}
      ${descriptionMarkup}
      </section>`
    );
  }

  return ``;
};

const createOffersMarkup = (selectedOffers) => {
  let isChecked;

  let markup = `
    <section class="event__section  event__section--offers ">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">`;

  markup = markup + offers
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

  markup += `
      </div>
    </section>`;

  return markup;
};

const createDescriptionMarkup = (currentDestination) => {
  const destinationInfo = generateDestination(currentDestination);
  if (!destinationInfo.description) {
    return ``;
  }
  const {description, pictures} = destinationInfo;

  return (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
      <div class="event__photos-tape">
    ${pictures.map((photo) => {
      return `<img class="event__photo" src="${photo}">`;
    }).join(`\n`)}
      </div>
      </div>
    </section>`
  );
};

export const createEditEventFormTemplate = (event, mode, options = {}) => {
  const {isFavorite} = event;
  const {type, destination: eventDestination, price, dateStart, dateEnd, selectedOffers} = options;

  const dayStart = getDate(dateStart);
  const timeStart = getTime(dateStart);
  const dayEnd = getDate(dateEnd);
  const timeEnd = getTime(dateEnd);
  const encodeDestination = encode(eventDestination);
  const preposition = getPrepositionFromType(type);

  const typeSelectMarkup = createTypeSelectMarkup(type);
  const destinationSelectMarkup = createDestinationSelectMarkup();
  const rollupButtonMarkup = createRollupButtonMarkup(mode);
  const deleteButtonMarkup = createDeleteButtonMarkup(mode);
  const favoriteButtonMarkup = createFavoriteButtonMarkup(isFavorite, mode);
  const saveButtonMarkup = createSaveButtonMarkup(mode);

  const offersMarkup = createOffersMarkup(selectedOffers); // type ? offers : ``
  const descriptionMarkup = createDescriptionMarkup(eventDestination); // destination ? info : ``

  const detailsMarkup = createDetailsContainerMarkup(offersMarkup, descriptionMarkup);

  return (
    `<form class="trip-events__item event  event--edit" action="#" method="post">
      <header class="event__header">
      <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
          ${typeSelectMarkup}
          </div>

      </div>

      <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${capitalizeFirstLetter(type)} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" 
          type="text" name="event-destination" value="${encodeDestination}" list="destination-list-1">
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
          <span class="visually-hidden">Price</span>&euro;</label>
          <input class="event__input  event__input--price" id="event-price-1" 
          type="text" name="event-price" value="${price}">
      </div>

      ${saveButtonMarkup}

      ${deleteButtonMarkup}
      
      ${favoriteButtonMarkup}
      
      ${rollupButtonMarkup}
      </header>

      ${detailsMarkup}
    </form>`
  );
};

const isSelectedOffer = (selectedOffers, currentOffer) => {
  return selectedOffers.some((offer) => offer.desc === currentOffer);
};

const getOfferIndex = (allOffers, currentOffer) => {
  return allOffers.findIndex((offer) => offer.desc === currentOffer);
};

const parseFormData = (formData) => {
  const type = formData.get(`event-type`);
  const isFavorite = formData.get(`event-favorite`) === `on`;
  const selectedOffers = [];

  for (let key of formData.keys()) {
    if (key.startsWith(`event-offer`)) {
      const currentOffer = key.substring(12);
      const index = offers.findIndex((offer) => offer.type === currentOffer);
      selectedOffers.push(offers[index]);
    }
  }

  const price = Number(formData.get(`event-price`));
  let totalPrice = price;
  for (const offer of selectedOffers) {
    totalPrice = totalPrice + offer.price;
  }

  return {
    id: formData.get(`event-id`),
    type,
    destination: formData.get(`event-destination`),
    price,
    totalPrice,
    dateStart: new Date(formData.get(`event-start-time`)),
    dateEnd: new Date(formData.get(`event-end-time`)),
    selectedOffers,
    isFavorite,
  };
};

export default class EditFormComponent extends AbstractSmartComponent {
  constructor(event, eventControllerMode) {
    super();

    this._event = event;
    this._mode = eventControllerMode;

    this._eventType = event.type;
    this._destination = event.destination;
    this._price = event.price;
    this._selectedOffers = event.selectedOffers.slice();
    this._flatpicrStart = null;
    this._flatpicrEnd = null;

    this._closeHandler = null;
    this._deleteHandler = null;
    this._favoriteHandler = null;
    this._submitHandler = null;

    this._applyFlatpicr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventFormTemplate(this._event, this._mode, {
      type: this._eventType,
      destination: this._destination,
      dateStart: this._flatpicrStart,
      dateEnd: this._flatpicrEnd,
      price: this._price,
      selectedOffers: this._selectedOffers,
    });
  }

  rerender() {
    super.rerender();
    this._applyFlatpicr();
  }

  reset() {
    const event = this._event;

    this._eventType = event.type;
    this._destination = event.destination;
    this._price = event.price;
    this._selectedOffers = event.selectedOffers.slice();

    this.rerender();
  }

  recoveryListeners() {
    this.setCloseEditButtonClickHandler(this._closeHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteHandler);
    this._subscribeOnEvents();
  }

  removeElement() {
    this._destroyFlatpicr();

    super.removeElement();
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    formData.append(`event-id`, this._event.id);

    return parseFormData(formData);
  }

  setCloseEditButtonClickHandler(handler) {
    if (this._mode === Mode.ADDING) {
      return;
    }

    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._closeHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _generateDestinationInfo(city = ``) {
    if (city) {
      return;
    }
  }

  _destroyFlatpicr() {
    if (this._flatpicrStart) {
      this._flatpicrStart.destroy();
      this._flatpicrStart = null;
    }
    if (this._flatpicrEnd) {
      this._flatpicrEnd.destroy();
      this._flatpicrEnd = null;
    }
  }

  _applyFlatpicr() {
    this._destroyFlatpicr();

    const dateStartElement = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);
    let eventDateStart = this._event.dateStart;

    this._flatpicrStart = flatpicr(dateStartElement, {
      "altFormat": `d/m/y H:i`,
      "altInput": true,
      "allowInput": true,
      "enableTime": true,
      "time_24hr": true,
      "defaultDate": this._event.dateStart || `today`,
      onChange(selectedDates, dateStr) {
        eventDateStart = dateStr;
      }
    });

    this._flatpicrEnd = flatpicr(dateEndElement, {
      "altFormat": `d/m/y H:i`,
      "altInput": true,
      "allowInput": true,
      "enableTime": true,
      "time_24hr": true,
      "defaultDate": this._event.dateEnd || `today`,
      onOpen() {
        this.set(`minDate`, eventDateStart);
      }
    });
  }

  _subscribeOnEvents() {

    const canISaveIt = () => {
      element.querySelector(`.event__save-btn`)
        .disabled = !Number.isInteger(this._price) || !this._destination;
    };

    const offersAll = offers.slice();
    const element = this.getElement();

    canISaveIt();

    const eventTypeElements = element.querySelectorAll(`.event__type-label`);
    eventTypeElements.forEach((item) => {
      item.addEventListener(`click`, () => {
        this._eventType = item.textContent.toLowerCase();

        this.rerender();
      });
    });

    const destinationElement = element.querySelector(`.event__input--destination`);
    destinationElement.addEventListener(`change`, () => {
      this._destination = destinationElement.value;

      this.rerender();
    });

    const priceElement = element.querySelector(`#event-price-1`);
    priceElement.addEventListener(`input`, (evt) => {
      this._price = Number(evt.target.value);

      canISaveIt();
    });

    const offersElements = element.querySelectorAll(`.event__offer-label`);
    offersElements.forEach((offer) => {
      offer.addEventListener(`click`, () => {
        const offerDesc = offer.querySelector(`span`).textContent;

        if (isSelectedOffer(this._selectedOffers, offerDesc)) {
          const index = getOfferIndex(this._selectedOffers, offerDesc);
          this._selectedOffers = [].concat(this._selectedOffers.slice(0, index), this._selectedOffers.slice(index + 1));
        } else {
          const index = getOfferIndex(offersAll, offerDesc);
          this._selectedOffers.push(offersAll[index]);
        }
      });
    });

    if (this._mode !== Mode.ADDING) {
      const favoriteElement = element.querySelector(`.event__favorite-btn`);
      favoriteElement.addEventListener(`click`, () => {
        this._event.isFavorite = !this._event.isFavorite;
      });
    }
  }
}
