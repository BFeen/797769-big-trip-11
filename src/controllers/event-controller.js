import EditFormComponent from "../components/edit-event";
import TripEventComponent from "../components/trip-event";
import {render, replace, remove, RenderPosition} from "../utils/render";


export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {};

export default class EventController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._tripEventComponent = null;
    this._editFormComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._replaceEventToEdit = this._replaceEventToEdit.bind(this);
    this._replaceEditToEvent = this._replaceEditToEvent.bind(this);
  }

  render(event, mode) {
    const oldEventComponent = this._tripEventComponent;
    const oldEventEditComponent = this._editFormComponent;
    this._mode = mode;

    this._tripEventComponent = new TripEventComponent(event);
    this._editFormComponent = new EditFormComponent(event);

    this._tripEventComponent.setEditButtonClickHandler(this._replaceEventToEdit);
    this._editFormComponent.setCloseEditButtonClickHandler(this._replaceEditToEvent);

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editFormComponent.getData();
      this._onDataChange(this, event, data);
    });

    this._editFormComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, event, null));

    if (oldEventComponent && oldEventEditComponent) {
      replace(this._tripEventComponent, oldEventComponent);
      replace(this._editFormComponent, oldEventEditComponent);
      this._replaceEditToEvent();
    } else {
      render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
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
    this._onViewChange();
    document.addEventListener(`keydown`, this._onEscKeyDown);
    replace(this._tripEventComponent, this._editFormComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    this._editFormComponent.reset();
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    if (document.contains(this._editFormComponent.getElement())) {
      replace(this._editFormComponent, this._tripEventComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
    }
  }
}
