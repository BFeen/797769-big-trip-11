import TripInfoComponent from "./components/trip-info.js";
import MenuComponent from "./components/menu.js";
import FiltersComponent from "./components/filters.js";
import SortingComponent from "./components/sorting.js";
import TripDaysComponent from "./components/trip-days.js";
import TripPointComponent from "./components/trip-point.js";
import AddEventFormComponent from "./components/add-event-form.js";
import TripEventsComponent from "./components/trip-events.js"
import {generateFilters} from "./mock/filters.js";
import {generatePoints} from "./mock/trip-point.js";
import { render, RenderPosition } from "./utils.js";


const POINT_COUNT = 3;

const header = document.querySelector(`.page-header`);
const tripMain = header.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const filters = generateFilters();
const points = generatePoints(POINT_COUNT);


const menuComponent = new MenuComponent();
const filtersComponent = new FiltersComponent(filters);
render(tripControls, menuComponent.getElement(), RenderPosition.AFTERBEGIN);
render(tripControls, filtersComponent.getElement(), RenderPosition.BEFOREEND);


const main = document.querySelector(`.page-main`);
const tripEvents = main.querySelector(`.trip-events`);


const addEventFormComponent = new AddEventFormComponent();
const sortingComponent = new SortingComponent();
const tripDaysComponent = new TripDaysComponent();
render(tripEvents, addEventFormComponent.getElement(), RenderPosition.BEFOREEND);
render(tripEvents, sortingComponent.getElement(), RenderPosition.BEFOREEND);
render(tripEvents, tripDaysComponent.getElement(), RenderPosition.BEFOREEND);

const tripEventsList = tripEvents.querySelector(`.trip-events__list`);
let totalPrice = 0;

points
  .forEach((point) => {
    render(tripEventsList, createTripPointTemplate(point));
    totalPrice = titalPrice + point.price;
  });

const tripInfoComponent = new TripInfoComponent();
render(tripMain, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
