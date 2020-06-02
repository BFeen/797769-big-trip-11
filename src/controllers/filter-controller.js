import FilterComponent from "../components/filters.js";
import {getEventsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";


export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._activeFilter = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const events = this._eventsModel.getEventsAll().slice();
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      const filteredEvents = getEventsByFilter(events, filterType);
      return {
        name: filterType,
        checked: filterType === this._activeFilter,
        isDisabled: filteredEvents.length === 0 ? `disabled` : ``,
        // ЭКРАНИРОВАТЬ EVENT.PRICE
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(oldComponent, this._filterComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFORE_END);
    }
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilter = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
