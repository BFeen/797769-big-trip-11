import DayInfoComponent from "../components/day-info";
import EventController from "./event-controller";
import NoEventsComponent from "../components/no-events.js";
import TripDaysComponent from "../components/trip-days.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import {render, remove, RenderPosition} from "../utils/render";
import {formatDay} from "../utils/common.js";
import moment from "moment";


const formatEventsByDay = (events) => {
  const days = getUniqueDays(events);

  return days.map((day) => {
    return {
      day,
      eventsGroup: events.filter((event) => formatDay(event.dateStart) === day),
    }
  });
}

const getRenderedDay = (tripDaysComponent, day, counter) => {
  const dayInfoComponent = new DayInfoComponent(day, counter);
  render(tripDaysComponent.getElement(), dayInfoComponent, RenderPosition.BEFOREEND);

  return dayInfoComponent.getElement().querySelector(`.trip-events__list`);
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const showingEvents = events.slice();
  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = showingEvents;
      break;
    case SortType.TIME:
      sortedEvents = showingEvents
        .sort((a, b) => (b.dateEnd - b.dateStart) - (a.dateEnd - a.dateStart));
      break;
    case SortType.PRICE:
      sortedEvents = showingEvents
        .sort((a, b) => b.totalPrice - a.totalPrice);
      break;
  }

  return sortedEvents;
};

const getUniqueDays = (events) => {
  const days = events.map((event) => {
    return moment(event.dateStart).format(`MMM DD`);
  });
  return [...new Set(days)];
};

const renderEvents = (eventsListElement, events, onDataChange, onViewChange) => {
  return events.map((event) => {
    const eventController = new EventController(eventsListElement, onDataChange, onViewChange);
    eventController.render(event);

    return eventController;
  });
};

const renderDays = (tripDaysComponent, events, onDataChange, onViewChange) => {
  const eventsByDay = formatEventsByDay(events);
  let eventControllers = [];

  eventsByDay
    .forEach((dayEvents, index) => {
      const {day, eventsGroup} = dayEvents;
      const dayElement = getRenderedDay(tripDaysComponent, day, index + 1);
      eventControllers = eventControllers.concat(renderEvents(dayElement, eventsGroup, onDataChange, onViewChange));
    });
  return eventControllers;
};

export default class TripController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._eventControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const events = this._eventsModel.getEvents();

    if (events.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    this._renderEventsByDays(events);
  }

  _removeEvents() {
    this._eventControllers.forEach((eventController) => eventController.destroy());
    this._eventControllers = [];
  }

  _renderEventsByDays(events) {
    const newEvents = renderDays(this._tripDaysComponent, events, this._onDataChange, this._onViewChange);
    this._eventControllers = newEvents;  
  }

  _renderEventsWithoutDays(events) {
    const tripEventListElement = getRenderedDay(this._tripDaysComponent);
    const newEvents = renderEvents(tripEventListElement, events, this._onDataChange, this._onViewChange);
    this._eventControllers = newEvents;
  }

  _onDataChange(eventController, oldData, newData) {
    const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

    if (isSuccess) {
      eventController.render(newData);
    }
  }

  _onFilterChange() {
    if (this._sortingComponent.getSortType() !== SortType.EVENT) {
      this._sortingComponent.setDefaultType();
      this._onSortTypeChange(SortType.EVENT);
    }
    this._updateEvents();
  }

  _onViewChange() {
    this._eventControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._eventsModel.getEvents(), sortType);

    this._removeEvents();
    this._tripDaysComponent.getElement().innerHTML = ``;

    if (sortType === SortType.EVENT) {
      this._renderEventsByDays(sortedEvents);
    } else {
      // удаление "DAY" из сортировки
      this._renderEventsWithoutDays(sortedEvents)
    }
  }

  _updateEvents() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._removeEvents();
    this._renderEventsByDays(this._eventsModel.getEvents());
  }
}
