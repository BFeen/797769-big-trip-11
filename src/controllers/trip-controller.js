import DayInfoComponent from "../components/day-info";
import {FilterType} from "../const.js";
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
    case SortType.TIME:
      return unsortedEvents
        .sort((a, b) => (b.dateEnd - b.dateStart) - (a.dateEnd - a.dateStart));
    case SortType.PRICE:
      return unsortedEvents
        .sort((a, b) => b.totalPrice - a.totalPrice);
  }
  return unsortedEvents;
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
      eventControllers = eventControllers
        .concat(renderEvents(eventsListElement, eventsGroup, offers, destinations, onDataChange, onViewChange));
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
    this._noEventsComponent = null;
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

    if (events.length === 0) {
      this._noEventsComponent = new NoEventsComponent();
      render(container, this._noEventsComponent, RenderPosition.BEFORE_END);
      return;
    } else if (this._noEventsComponent) {
      remove(this._noEventsComponent);
    }
    
    render(container, this._sortingComponent, RenderPosition.AFTER_BEGIN);
    render(container, this._tripDaysComponent, RenderPosition.BEFORE_END);

    const offers = this._eventsModel.getOffers();
    const destinations = this._eventsModel.getDestinations();
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
    this._addEventButton.disabled = true;

    if (this._eventsModel.getActiveFilter() !== FilterType.EVERYTHING) {
      this._eventsModel.resetFilter();
    }

    const offers = this._eventsModel.getOffers();
    const destinations = this._eventsModel.getDestinations();

    this._onViewChange();

    const eventsListElement = this._container.getElement();
    this._creatingEvent = new EventController(eventsListElement, offers, destinations, this._onDataChange, this._onViewChange);
    this._creatingEvent.render(EmptyEvent, EventControllerMode.ADDING);
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

  _onDataChange(eventController, oldData, newData, isChangeView = true) {
    console.log(`DataChange`)
    this._addEventButton.disabled = false;
    if (oldData === EmptyEvent) { // создание
      this._creatingEvent = null;

      if (newData === null) { // закрытие создания без сохранения
        eventController.destroy();
        
      } else { // сохранение нового маршрута

        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            eventController.render(eventModel, EventControllerMode.DEFAULT);
    
            this._updateEvents();
          })
          .catch(() => {
            eventController.shake();
          });
      }
    } else if (newData === null) { // удаление
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          this._updateEvents();

          if (this._eventControllers.length === 0) {
            this.render();
          }
        })
        .catch(() => {
          eventController.shake();
        });
    } else { // Обновление
      this._api.updateEvent(oldData.id, newData)
        .then((EventModel) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, EventModel);

          if (isSuccess) {
            if (isChangeView) {
              eventController.render(EventModel, EventControllerMode.DEFAULT);
              this._updateEvents();
            } 
            else {
              // eventController.render(EventModel, EventControllerMode.DEFAULT); // костыль, который копит флатпикерсы
              // eventController._replaceEventToEdit();
            }
          }
        })
        .catch(() => {
          eventController.shake();
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
    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      this._creatingEvent = null;
      this._addEventButton.disabled = false;
    }
    this._eventControllers.forEach((item) => item.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._removeEvents();
    this._tripDaysComponent.getElement().innerHTML = ``;
    this.setSortType(sortType);
    this.render();
  }

  _updateEvents() {
    this._tripDaysComponent.getElement().innerHTML = ``;
    this._removeEvents();
    this.render()
  }
}
