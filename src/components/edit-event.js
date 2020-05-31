import AbstractSmartComponent from "./abstract-smart-component.js";
import {capitalizeFirstLetter, createOfferType, getPrepositionFromType, getTime, getDate} from "../utils/common.js";
import {EventTypes, EmptyDestination} from "../const.js";
import {Mode} from "../controllers/event-controller.js";
import {encode} from "he";
import flatpicr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";
import { relativeTimeThreshold } from "moment";


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

  for (const [key, values] of Object.entries(EventTypes)) {
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

const createDestinationSelectMarkup = (destinations) => {
  return destinations
    .map((destination) => {
      const {name: city} = destination;
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

const createOffersMarkup = (availableOffers, selectedOffers) => {
  const {offers} = availableOffers;
  if (offers.length === 0) {
    return ``;
  }

  let markup = `
    <section class="event__section  event__section--offers ">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">`;

  markup = markup + offers
    .map((offer) => {
      const {title, price} = offer;
      const type = createOfferType(title);
      let isChecked = ``;

      for (const element of selectedOffers) {
        if (element.title === title) {
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
          <span class="event__offer-title">${title}</span>
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
  const {description, pictures} = currentDestination;
  if (!description) {
    return ``;
  }

  return (`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
      <div class="event__photos-tape">
    ${pictures.map((photo) => {
      const {src, description: pictureInfo} = photo;
      return `<img class="event__photo" alt="${pictureInfo}" title="${pictureInfo}" src="${src}">`;
    }).join(`\n`)}
      </div>
      </div>
    </section>`
  );
};

export const createEditEventFormTemplate = (event, mode, options = {}) => {
  const {isFavorite} = event;
  const {type, destination: eventDestination, price, dateStart, dateEnd, selectedOffers, availableOffers, Destinations} = options;
  const {name: destinationName} = eventDestination;

  const dayStart = getDate(dateStart);
  const timeStart = getTime(dateStart);
  const dayEnd = getDate(dateEnd);
  const timeEnd = getTime(dateEnd);
  const preposition = getPrepositionFromType(type);

  const typeSelectMarkup = createTypeSelectMarkup(type);
  const destinationSelectMarkup = createDestinationSelectMarkup(Destinations);

  const rollupButtonMarkup = createRollupButtonMarkup(mode);
  const deleteButtonMarkup = createDeleteButtonMarkup(mode);
  const favoriteButtonMarkup = createFavoriteButtonMarkup(isFavorite, mode);
  const saveButtonMarkup = createSaveButtonMarkup(mode);

  const offersMarkup = createOffersMarkup(availableOffers, selectedOffers);
  const descriptionMarkup = createDescriptionMarkup(eventDestination);
  const detailsMarkup = createDetailsContainerMarkup(offersMarkup, descriptionMarkup);

  const itemClass = mode === Mode.ADDING ? `trip-events__item` : ``;

  return (
    `<form class="event ${itemClass} event--edit" action="#" method="post">
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
          type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
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
  return selectedOffers.some((offer) => offer.title === currentOffer);
};

const getOfferIndex = (offersAll, currentOffer) => {
  return offersAll.findIndex((offer) => offer.title === currentOffer);
};

export default class EditFormComponent extends AbstractSmartComponent {
  constructor(event, offers, destinations, eventControllerMode) {
    super();

    this._event = Object.assign({}, event);
    this._mode = eventControllerMode;
    this._offersAll = offers.slice();
    this._destinationsAll = destinations.slice();

    this._eventType = event.type;
    this._destination = event.destination;
    this._price = event.price;
    this._availableOffers = this._offersAll.find((item) => item.type === this._eventType);
    this._selectedOffers = event.selectedOffers.slice();
    this._dateStart = event.dateStart;
    this._dateEnd = event.dateEnd;

    this._flatpicrStart = null;
    this._flatpicrEnd = null;

    this._closeHandler = null;
    this._deleteHandler = null;
    this._favoriteHandler = null;
    this._submitHandler = null;

    this.savebutton = null;
    this.deleteButton = null;

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
      availableOffers: this._availableOffers,
      Destinations: this._destinationsAll,
    });
  }

  setCloseEditButtonClickHandler(handler) {
    if (this._mode === Mode.ADDING) {
      return;
    }

    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._closeHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    if (this._mode === Mode.ADDING) {
      return;
    }

    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, handler);

    this._favoriteHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this._deleteButton = this.getElement().querySelector(`.event__reset-btn`);
    this._deleteButton.addEventListener(`click`, handler);

    this._deleteHandler = handler;
  }

  setSubmitHandler(handler) {
    this._savebutton = this.getElement().querySelector(`.event__save-btn`);
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    formData.append(`event-id`, this._event.id);

    return formData;
  }

  rerender() {
    super.rerender();
    this.applyFlatpicr();
  }

  reset() {
    const event = this._event;

    this._eventType = event.type;
    this._destination = event.destination;
    this._price = event.price;
    this._selectedOffers = event.selectedOffers.slice();
    this._availableOffers = this._offersAll.find((item) => item.type === this._eventType);
    this._dateStart = event.dateStart;
    this._dateEnd = event.dateEnd;

    this.destroyFlatpicr();
    this.rerender();
  }

  recoveryListeners() {
    this.setCloseEditButtonClickHandler(this._closeHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteHandler);
    this.setFavoriteButtonClickHandler(this._favoriteHandler);
    this._subscribeOnEvents();
  }

  applyFlatpicr() {
    this.destroyFlatpicr();

    const dateStartElement = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndElement = this.getElement().querySelector(`#event-end-time-1`);
    let eventDateStart = this._dateStart;

    this._flatpicrStart = flatpicr(dateStartElement, {
      "altFormat": `d/m/y H:i`,
      "altInput": true,
      "allowInput": true,
      "enableTime": true,
      "time_24hr": true,
      "defaultDate": this._dateStart || `today`,
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
      "defaultDate": this._dateEnd || `today`,
      onOpen() {
        this.set(`minDate`, eventDateStart);
      }
    });
  }

  toggleClass(className) {
    this.getElement().classList.toggle(`${className}`);
  }

  enablingForm() {
    const buttonText = this._mode === Mode.ADDING ? `Cancel` : `Delete`;

    this._deleteButton.textContent = buttonText;
    this._savebutton.textContent = `Save`;
    const formElements = this.getElement().querySelectorAll(`button`);
    formElements.forEach((item) => item.removeAttribute(`disabled`));
  }

  disablingSaveButton() {
    this._savebutton.textContent = `Saving...`;
    this._disablingForm();
  }

  disablingDeleteButton() {
    this._deleteButton.textContent = `Deleting...`;
    this._disablingForm();
  }

  destroyFlatpicr() {
    if (this._flatpicrStart) {
      this._flatpicrStart.destroy();
      this._flatpicrStart = null;
    }
    if (this._flatpicrEnd) {
      this._flatpicrEnd.destroy();
      this._flatpicrEnd = null;
    }
  }

  removeElement() {
    this.destroyFlatpicr();
    super.removeElement();
  }

  _disablingForm() {
    const formElements = this.getElement().querySelectorAll(`button`);
    formElements.forEach((item) => item.setAttribute(`disabled`, `disabled`));
  }

  _subscribeOnEvents() {
    const checkSaveButtonDisabling = () => {
      element.querySelector(`.event__save-btn`)
        .disabled = !Number.isInteger(this._price) || !destinationElement.value;
    };

    const element = this.getElement();
    const destinationElement = element.querySelector(`.event__input--destination`);

    checkSaveButtonDisabling();

    const eventTypeElements = element.querySelectorAll(`.event__type-label`);
    eventTypeElements.forEach((item) => {
      item.addEventListener(`click`, () => {
        this._eventType = item.textContent.toLowerCase();
        this._availableOffers = this._offersAll.find((offer) => offer.type === this._eventType);
        this._selectedOffers = [];

        this.rerender();
      });
    });

    destinationElement.addEventListener(`change`, () => {
      const cityFromDestinations = this._destinationsAll.find((item) => item.name.toLowerCase() === destinationElement.value.toLowerCase());
      if (cityFromDestinations) {
        this._destination = cityFromDestinations;
      } else {
        this._destination = Object.assign({}, EmptyDestination, {name: encode(destinationElement.value)});
      }

      this.rerender();
    });

    const dateStartElement = element.querySelector(`#event-start-time-1`);
    dateStartElement.addEventListener(`change`, () => {
      this._dateStart = new Date(dateStartElement.value);
    });

    const dateEndElement = element.querySelector(`#event-end-time-1`);
    dateEndElement.addEventListener(`change`, () => {
      this._dateEnd = new Date(dateEndElement.value);
    });

    const priceElement = element.querySelector(`#event-price-1`);
    priceElement.addEventListener(`input`, (evt) => {
      this._price = Math.abs(Number(evt.target.value));

      checkSaveButtonDisabling();
    });

    const offersElements = element.querySelectorAll(`.event__offer-label`);
    offersElements.forEach((offer) => {
      offer.addEventListener(`click`, () => {
        const offerTitle = offer.querySelector(`span`).textContent;

        if (isSelectedOffer(this._selectedOffers, offerTitle)) {
          const index = getOfferIndex(this._selectedOffers, offerTitle);
          this._selectedOffers = [].concat(this._selectedOffers.slice(0, index), this._selectedOffers.slice(index + 1));
        } else {
          const {offers} = this._availableOffers;
          const index = getOfferIndex(offers, offerTitle);
          this._selectedOffers.push(this._offersAll[index]);
        }
      });
    });

    element.querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, () => {
        this._event.isFavorite = !this._event.isFavorite;

        this.rerender();
      });
  }
}
