import DayInfoComponent from "../components/day-info";
import EventController, {Mode as EventControllerMode, EmptyEvent} from "./event-controller";
import NoEventsComponent from "../components/no-events.js";
import TripDaysComponent from "../components/trip-days.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import {render, RenderPosition, remove} from "../utils/render";
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
  const unsortedEvents = events.slice();
  switch (sortType) {
    case SortType.EVENT:
      return unsortedEvents;
    case SortType.TIME:
      return unsortedEvents
        .sort((a, b) => (b.dateEnd - b.dateStart) - (a.dateEnd - a.dateStart));
    case SortType.PRICE:
      return unsortedEvents
        .sort((a, b) => b.totalPrice - a.totalPrice);
  }
};

const getUniqueDays = (events) => {
  const days = events.map((event) => {
    return moment(event.dateStart).format(`MMM DD`);
  });
  return [...new Set(days)];
};

const renderEvents = (eventsListElement, events, offers, destinations, onDataChange, onViewChange) => {
  return events.map((event) => {
    const eventController = new EventController(eventsListElement, offers, destinations, onDataChange, onViewChange);
    eventController.render(event, EventControllerMode.DEFAULT);

    return eventController;
  });
};

const renderDays = (tripDaysComponent, events, offers, destinations, onDataChange, onViewChange) => {
  const eventsByDay = formatEventsByDay(events);
  let eventControllers = [];

  eventsByDay
    .forEach((dayEvents, index) => {
      const {day, eventsGroup} = dayEvents;
      const eventsListElement = getRenderedDay(tripDaysComponent, day, index + 1);
      eventControllers = eventControllers.concat(renderEvents(eventsListElement, eventsGroup, offers, destinations, onDataChange, onViewChange));
    });
  return eventControllers;
};

export default class TripController {
  constructor(container, eventsModel, addEventButtonComponent, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._api = api;

    this._sortType = SortType.EVENT;
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

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {
    const container = this._container.getElement();
    const events = getSortedEvents(this._eventsModel.getEvents(), this._sortType);
    const offers = this._eventsModel.getOffers();
    const destinations = this._eventsModel.getDestinations();

    if (events.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.BEFORE_END);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.AFTER_BEGIN);
    render(container, this._tripDaysComponent, RenderPosition.BEFORE_END);

    this._removeEvents();
    this._tripDaysComponent.getElement().innerHTML = ``;
    const dayElement = this._sortingComponent.getElement().querySelector(`.trip-sort__item--day`);

    if (this._sortType === SortType.EVENT) {
      dayElement.textContent = `Day`;
      this._renderEventsByDays(events, offers, destinations);
    } else {
      dayElement.textContent = ``;
      this._renderEventsWithoutDays(events, offers, destinations);
    }
  }

  createEvent() {
    if (this._creatingEvent) {
      return;
    }
    this._addEventButton.disabled = !this._creatingEvent;

    this._eventsModel.resetFilter();
    this._onViewChange();

    const offers = this._eventsModel.getOffers();
    const destinations = this._eventsModel.getDestinations();

    const eventsListElement = this._container.getElement();
    this._creatingEvent = new EventController(eventsListElement, offers, destinations, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(EmptyEvent, EventControllerMode.ADDING);
    // this._eventControllers = [].concat(this._eventControllers, this._creatingEvent);
  }

  setSortType(sortType) {
    this._sortType = sortType;
  }

  _removeEvents() {
    this._eventControllers.forEach((eventController) => eventController.destroy());
    this._eventControllers = [];
  }

  _renderEventsByDays(events, offers, destinations) {
    const newEvents = renderDays(this._tripDaysComponent, events, offers, destinations, this._onDataChange, this._onViewChange);
    this._eventControllers = newEvents;
  }

  _renderEventsWithoutDays(events, offers, destinations) {
    const tripEventListElement = getRenderedDay(this._tripDaysComponent);
    const newEvents = renderEvents(tripEventListElement, events, offers, destinations, this._onDataChange, this._onViewChange);
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
        if (this._eventControllers.length === 0) {
          remove(this._noEventsComponent);
        }

        this._eventsModel.addEvent(newData);
        eventController.render(newData, EventControllerMode.DEFAULT); // Это переданный контроллер
        this.render();

        this._eventControllers = [].concat(eventController, this._eventControllers);
        this._updateEvents(); // ??? апдейт сразу удаляет только что созданный контроллер
      }
    } else if (newData === null) {
      this._eventsModel.removeEvent(oldData.id);
      this._updateEvents();

      if (this._eventControllers.length === 0) {
        this.render();
        return;
      }

      this._onSortTypeChange(this._sortingComponent.getSortType());
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((updatingEvent) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, updatingEvent);
    
          if (isSuccess) {
            eventController.render(updatingEvent, EventControllerMode.DEFAULT);
    
            this._onSortTypeChange(this._sortingComponent.getSortType());
          }
        });
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
    this.setSortType(sortType);
    this.render();
  }

  _updateEvents() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._removeEvents();
    this._renderEventsByDays(this._eventsModel.getEvents(), this._eventsModel.getOffers(), this._eventsModel.getDestinations());
  }
}
