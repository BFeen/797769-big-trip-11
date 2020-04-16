import {createTripInfoTemplate} from "./components/trip-info.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFiltersTemplate} from "./components/filters.js";
import {createSortTemplate} from "./components/sorting.js";
import {createTripDaysTemplate} from "./components/trip-days.js";
import {createTripPointTemplate} from "./components/trip-point.js";
import {createAddEventFormTemplate} from "./components/add-event-form.js";
import {createEditEventFormTemplate} from "./components/edit-event.js";
import {generateFilters} from "./mock/filters.js";
import {generatePoints} from "./mock/trip-point.js";

const POINT_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const filters = generateFilters();
const points = generatePoints(POINT_COUNT);


render(tripControls, createMenuTemplate(), `afterbegin`);
render(tripControls, createFiltersTemplate(filters));

const main = document.querySelector(`.page-main`);
const tripEvents = main.querySelector(`.trip-events`);

render(tripEvents, createAddEventFormTemplate());
render(tripEvents, createSortTemplate());
render(tripEvents, createTripDaysTemplate());

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);
let totalPrice = null;

points
  .forEach((point, index) => {
    render(tripEventsList, createTripPointTemplate(point));
    if (index === 0) {
      render(tripEventsList, createEditEventFormTemplate(point));
    };
    totalPrice += point.price;
  }); 

render(tripMain, createTripInfoTemplate(totalPrice), `afterbegin`);