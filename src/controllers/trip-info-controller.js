import TripInfoComponent from "../components/trip-info.js";
import {remove, RenderPosition} from "../utils/render.js";

export default class TripInfoController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    
    this._events = null;

    this._tripInfoComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    this._events = this._eventsModel.getEvents().slice();
    this._tripInfoComponent = new TripInfoComponent();

    render(this._container, this._tripInfoComponent, RenderPosition.BEFORE_END);
  }

  _rerender() {
    remove(this._tripInfoComponent);

    this.render();
  }

  _onDataChange() {
    this._rerender();
  }
}