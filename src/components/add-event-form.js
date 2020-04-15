import {pointType, destination, offers, generateRandomInfo, photoes} from "../mock/add-event-form.js";
import {capitalizeFirstLetter} from "../utils.js";

const createSelectPointTypeMarkup = () => {
  const {transfer, activity} = pointType;
  return (
    `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Transfer</legend>
      ${transfer.map((item) => {
          return (
              `<div class="event__type-item">
                <input id="event-type-${item}-1" 
                class="event__type-input  visually-hidden" 
                type="radio" 
                name="event-type" 
                value="${item}"
                >
                <label class="event__type-label  event__type-label--${item}" 
                for="event-type-${item}-1">
                ${capitalizeFirstLetter(item)}
                </label>
              </div>`
          );
      }).join(`\n`)}

    </fieldset>

    <fieldset class="event__type-group">
      <legend class="visually-hidden">Activity</legend>
      ${activity.map((item) => {
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
      
    </fieldset>
  </div>`
  );
};

const createDestinationSelectMarkup = () => {
  return destination
    .map((city) => {
        return (
            `<option value="${city}"></option>`
        );
    });
}

const createOffersMarkup = () => {
  return offers
    .map((offer) => {
      const {type, desc, price} = offer;
      const isChecked = Math.random() > 0.5;

      return (
        `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" 
            type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>

            <label class="event__offer-label" for="event-offer-${type}-1">
            <span class="event__offer-title">${desc}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
            </label>
        </div>`
      );
    }); 
}

export const createAddEventFormTemplate = () => {
  const type = `taxi`;
  const city = `Moscow`;
  const info = generateRandomInfo();

  const timeStart = `00:00`;
  const timeEnd = `00:00`;
  const dayStart = `18/03/2019`;
  const dayEnd = `21/03/2019`;

  const selectPointTypeMarkup = createSelectPointTypeMarkup();
  const destinationSelectMarkup = createDestinationSelectMarkup();
  const offersMarkup = createOffersMarkup();

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
    <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        ${selectPointTypeMarkup}

    </div>

    <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type} to
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
    
        ${destinationSelectMarkup}

        </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
        From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayStart} ${timeStart}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
        To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayEnd} ${timeEnd}">
    </div>

    <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
    <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${offersMarkup}
        </div>
    </section>

    <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${info}</p>

        <div class="event__photos-container">
        <div class="event__photos-tape">
        ${photoes.map((photo) => {
            return (
                `<img class="event__photo" src="${photo}">`
            );
        })}
        </div>
        </div>
    </section>
    </section>
  </form>`
  );
};  
