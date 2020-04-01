"use strict";

const POINT_COUNT = 3;

const createTripInfoTemplate = () => {
    return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

            <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
        </div>

        <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
        </p>
    </section>`
    );
};

const createMenuTemplate = () => {
    return (
        `<h2 class="visually-hidden">Switch trip view</h2>
        <nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
              <a class="trip-tabs__btn" href="#">Stats</a>
        </nav>`
    );
};

const createFiltersTemplate = () => {
    return (
        `<form class="trip-filters" action="#" method="get">
            <div class="trip-filters__filter">
            <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
            <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
            </div>

            <div class="trip-filters__filter">
            <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
            <label class="trip-filters__filter-label" for="filter-future">Future</label>
            </div>

            <div class="trip-filters__filter">
            <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
            <label class="trip-filters__filter-label" for="filter-past">Past</label>
            </div>

            <button class="visually-hidden" type="submit">Accept filter</button>
        </form>`
    );
};

const createSortTemplate = () => {
    return (
        `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <span class="trip-sort__item  trip-sort__item--day"></span>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event">
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" checked>
              <label class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" for="sort-time">
                Time
              </label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
              <label class="trip-sort__btn" for="sort-price">
                Price
              </label>
            </div>

            <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
        </form>`
    )
}

const createTripDaysTemplate = () => {
    return (
        `<ul class="trip-days">
            <li class="trip-days__item  day">
              <div class="day__info"></div>

                <ul class="trip-events__list"></ul>
            </li>
        </ul>`
    );
};

const createTripPointTemplate = () => {
    return (
        `<li class="trip-events__item">
            <div class="event">
            <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/drive.png" alt="Event type icon">
            </div>
            <h3 class="event__title">Drive to Chamonix</h3>

            <div class="event__schedule">
                <p class="event__time">
                <time class="event__start-time" datetime="2019-03-18T14:30">14:30</time>
                &mdash;
                <time class="event__end-time" datetime="2019-03-18T16:05">16:05</time>
                </p>
                <p class="event__duration">1H 35M</p>
            </div>

            <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">160</span>
            </p>

            <h4 class="visually-hidden">Offers:</h4>
            <ul class="event__selected-offers">
                <li class="event__offer">
                <span class="event__offer-title">Rent a car</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">200</span>
                </li>
            </ul>

            <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
            </button>
            </div>
        </li>`
    );
};

const render = (container, template, place='beforeend') => {
    container.insertAdjacentHTML(place, template);
}

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`)

render(tripMain, createTripInfoTemplate(), 'afterbegin');
render(tripControls, createMenuTemplate(), 'afterbegin');
render(tripControls, createFiltersTemplate());

const main = document.querySelector(`.page-main`);
const tripEvents = main.querySelector(`.trip-events`);

render(tripEvents, createSortTemplate());
render(tripEvents, createTripDaysTemplate());

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);

for (let i=0; i < POINT_COUNT; i++) {
    render(tripEventsList, createTripPointTemplate());
}