import EditFormComponent from "../components/edit-event";
import NoEventsComponent from "../components/no-events.js";
import TripDaysComponent from "../components/trip-days.js";
import TripEventComponent from "../components/trip-event";
import SortingComponent from "../components/sorting.js";
import {render, replace, RenderPosition} from "../utils/render";


const renderEvent = (tripEventsListElement, event) => {
  const replaceEventToEdit = () => {
    replace(editFormComponent, tripEventComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceEditToEvent = () => {
    replace(tripEventComponent, editFormComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
    }
  };

  const tripEventComponent = new TripEventComponent(event);
  tripEventComponent.setEditButtonClickHandler(replaceEventToEdit);

  const editFormComponent = new EditFormComponent(event);
  editFormComponent.setCloseEditButtonClickHandler(replaceEditToEvent);

  render(tripEventsListElement, tripEventComponent, RenderPosition.BEFOREEND);
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noEventsComponent = new NoEventsComponent();
    this._sortingComponent = new SortingComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._totalPrice = 0;
  }

  render(events) {
    const container = this._container.getElement();

    if (events.length === 0) {
      render(container, this._noEventsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    const tripEventsListElement = this._tripDaysComponent.getElement().querySelector(`.trip-events__list`);
    events
      .forEach((event) => {
        renderEvent(tripEventsListElement, event);
        this._totalPrice = this._totalPrice + event.price;
      });
  }
}
