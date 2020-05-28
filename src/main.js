import AddEventButtonComponent from "./components/add-event-button.js";
import API from "./api.js";
import EventsModel from "./models/trip-events.js";
import FilterController from "./controllers/filter-controller.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import NoEventsComponent from "./components/no-events.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip-controller.js";
import TripEventsComponent from "./components/trip-events.js";
import TripInfoComponent from "./components/trip-info.js";
import {render, RenderPosition, remove} from "./utils/render.js";

const AUTHORIZATION = `Basic JDKSL3sd!au-hjs=sEIQW`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip/`;

const api = new API(AUTHORIZATION, END_POINT);

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const main = document.querySelector(`.page-main`);
const mainContainer = main.querySelector(`.page-body__container`);

const menuComponent = new MenuComponent();
const addEventButtonComponent = new AddEventButtonComponent();
const tripEventsComponent = new TripEventsComponent();

const eventsModel = new EventsModel();
const tripController = new TripController(tripEventsComponent, eventsModel, addEventButtonComponent, api);
const filterController = new FilterController(tripControls, eventsModel);
const statisticsComponent = new StatisticsComponent(eventsModel);
const noEventsComponent = new NoEventsComponent();

render(tripControls, menuComponent, RenderPosition.AFTER_BEGIN);
filterController.render();
render(tripMain, addEventButtonComponent, RenderPosition.BEFORE_END);
render(mainContainer, tripEventsComponent, RenderPosition.BEFORE_END);
render(mainContainer, statisticsComponent, RenderPosition.BEFORE_END);
statisticsComponent.hide();

render(tripMain, new TripInfoComponent(0), RenderPosition.AFTER_BEGIN);
render(mainContainer, noEventsComponent, RenderPosition.BEFORE_END);
noEventsComponent.setLoadingView();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATISTICS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }
  menuComponent.setActiveItem(menuItem);
});

addEventButtonComponent.setAddNewEventHandler(() => {
  tripController.createEvent();
});

api.getData()
  .then((data) => {
    eventsModel.setEvents(data.events);
    eventsModel.setOffers(data.offers);
    eventsModel.setDestinations(data.destinations);
  })
  .then(() => {
    remove(noEventsComponent);
    tripController.render();
  })
  .catch((error) => {
    noEventsComponent.setErrorView(error);
  });
