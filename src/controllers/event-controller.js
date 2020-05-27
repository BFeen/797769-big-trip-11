import EditFormComponent from "../components/edit-event";
import EventModel from "../models/event.js";
import TripEventComponent from "../components/trip-event";
import {render, replace, remove, RenderPosition} from "../utils/render";


export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  type: `flight`,
  destination: ``,
  price: 0,
  totalPrice: 0,
  dateStart: Date.now(),
  dateEnd: Date.now(),
  selectedOffers: [],
  isFavorite: false,
};

export default class EventController {
  constructor(container, offers, destinations, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._offers = offers.slice();
    this._destinations = destinations;

    this._mode = Mode.DEFAULT;
    this._tripEventComponent = null;
    this._editFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    this._mode = mode;
    const oldEventComponent = this._tripEventComponent;
    const oldEventEditComponent = this._editFormComponent;

    this._tripEventComponent = new TripEventComponent(event);
    this._editFormComponent = new EditFormComponent(event, this._offers, this._destinations, this._mode);

    this._tripEventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
    });

    this._editFormComponent.setCloseEditButtonClickHandler(() => {
      this._replaceEditToEvent();
    });

    this._editFormComponent.setFavoriteButtonClickHandler(() => {
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;

      this._onDataChange(this, event, newEvent);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._editFormComponent.disablingSaveButton();
      const formData = this._editFormComponent.getData();
      const data = this._editFormComponent.parseFormData(formData);

      this._onDataChange(this, event, data);
    });

    this._editFormComponent.setDeleteButtonClickHandler(() => {
      if (this._mode === Mode.ADDING) {
        remove(this._editFormComponent);
      } else {
        this._onDataChange(this, event, null);
        this._editFormComponent.disablingDeleteButton();
      }
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(oldEventComponent, this._tripEventComponent);
          replace(oldEventEditComponent, this._editFormComponent);
          this._replaceEditToEvent();
        } else {
          render(this._container, this._tripEventComponent, RenderPosition.BEFORE_END);
        }
        break;
      case Mode.ADDING:
        if (oldEventComponent && oldEventEditComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container.firstChild, this._editFormComponent, RenderPosition.AFTER_END);
        break;
    }
  }

  destroy() {
    remove(this._editFormComponent);
    remove(this._tripEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _replaceEventToEdit() {
    if (document.contains(this._tripEventComponent.getElement())) {
      replace(this._tripEventComponent, this._editFormComponent);
    }
    this._onViewChange();
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._editFormComponent.applyFlatpicr();
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    this._editFormComponent.reset();

    if (document.contains(this._editFormComponent.getElement())) {
      replace(this._editFormComponent, this._tripEventComponent);
    }
    this._editFormComponent.destroyFlatpicr();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceEditToEvent();
    }
  }
}
