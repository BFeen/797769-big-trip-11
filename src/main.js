import FiltersComponent from "./components/filters.js";
import MenuComponent from "./components/menu.js";
import TripController from "./controllers/trip-controller.js";
import TripEventsComponent from "./components/trip-events.js";
import TripInfoComponent from "./components/trip-info.js";
import {generateFilters} from "./mock/filters.js";
import {generateEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils/render.js";


const EVENT_COUNT = 10;

const headerMain = document.querySelector(`.trip-main`);
const tripControls = headerMain.querySelector(`.trip-controls`);

const filters = generateFilters();

render(tripControls, new MenuComponent(), RenderPosition.AFTERBEGIN);
render(tripControls, new FiltersComponent(filters), RenderPosition.BEFOREEND);

const events = generateEvents(EVENT_COUNT);
events.sort((a,b) => a.dateStart.getTime() - b.dateStart.getTime());

const main = document.querySelector(`.page-main`);
const mainContainer = main.querySelector(`.page-body__container`);
const tripEventsComponent = new TripEventsComponent();
const tripEventsController = new TripController(tripEventsComponent);

render(mainContainer, tripEventsComponent, RenderPosition.BEFOREEND);

tripEventsController.render(events);

render(headerMain, new TripInfoComponent(0), RenderPosition.AFTERBEGIN);
