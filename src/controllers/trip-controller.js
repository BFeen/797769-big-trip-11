import DayInfoComponent from "../components/day-info";
import EventController, {Mode as EventControllerMode, EmptyEvent} from "./event-controller";
import NoEventsComponent from "../components/no-events.js";
import TripDaysComponent from "../components/trip-days.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import {render, RenderPosition} from "../utils/render";
import {formatDay} from "../utils/common.js";
import moment from "moment";


const formatEventsByDay = (events) => {
  const days = getUniqueDays(events);

  return days.map((day) => {
    return {
      day,
      eventsGroup: events.filter((event) => formatDay(event.dateStart) === day),
    };
  });
};

const getRenderedDay = (tripDaysComponent, day, counter) => {
  const dayInfoComponent = new DayInfoComponent(day, counter);
  render(tripDaysComponent.getElement(), dayInfoComponent, RenderPosition.BEFORE_END);

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
    eventController.render(event, EventControllerMode.DEFAULT);

    return eventController;
  });
};

const renderDays = (tripDaysComponent, events, onDataChange, onViewChange) => {
  const eventsByDay = formatEventsByDay(events);
  let eventControllers = [];

  eventsByDay
    .forEach((dayEvents, index) => {
      const {day, eventsGroup} = dayEvents;
      const eventsListElement = getRenderedDay(tripDaysComponent, day, index + 1);
      eventControllers = eventControllers.concat(renderEvents(eventsListElement, eventsGroup, onDataChange, onViewChange));
    });
  return eventControllers;
};

export default class TripController {
  constructor(container, eventsModel, addEventButtonComponent) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._eventControllers = [];
    this._creatingEvent = null;
    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._addEventButton = addEventButtonComponent.getElement();

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
      render(container, this._noEventsComponent, RenderPosition.BEFORE_END);
      return;
    }

    // const addEventButton = document.querySelector(`.trip-main__event-add-btn`);

    render(container, this._sortingComponent, RenderPosition.AFTER_BEGIN);
    render(container, this._tripDaysComponent, RenderPosition.BEFORE_END);

    this._renderEventsByDays(events);
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    this._addEventButton.disabled = !this._creatingEvent;

    this._eventsModel.resetFilter();

    const eventsListElement = this._container.getElement();
    this._creatingEvent = new EventController(eventsListElement, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(EmptyEvent, EventControllerMode.ADDING);
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
    if (oldData === EmptyEvent) {
      this._creatingEvent = null;
      this._addEventButton.disabled = false;
      if (newData === null) {
        eventController.destroy();
        this._updateEvents();
      } else {
        this._eventsModel.addEvent(newData);
        eventController.render(newData, EventControllerMode.DEFAULT);

        this._eventControllers = [].concat(eventController, this._eventControllers);
        this._updateEvents();
      }
    } else if (newData === null) {
      this._eventsModel.removeEvent(oldData.id);
      this._updateEvents();

      this._onSortTypeChange(this._sortingComponent.getSortType());
    } else {
      const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

      if (isSuccess) {
        eventController.render(newData, EventControllerMode.DEFAULT);

        this._onSortTypeChange(this._sortingComponent.getSortType());
      }
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
      this._renderEventsWithoutDays(sortedEvents);
    }
  }

  _updateEvents() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._removeEvents();
    this._renderEventsByDays(this._eventsModel.getEvents());
  }
}
