import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" ${isChecked === name ? 'checked' : ''} value="${name}" ${count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
  );
};

const createFiltersTemplate = (filterItems, isChecked) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, isChecked))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #isChecked = null;

  constructor(filters, isChecked) {
    super();
    this.#filters = filters;
    this.#isChecked = isChecked;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#isChecked);
  }

  setFilterChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}

