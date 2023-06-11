import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, isEmpty} = filter;

  return (
    `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" ${isChecked === name ? 'checked' : ''} value="${name}" ${isEmpty ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}" data-name="${name}" data-disabled="${isEmpty ? 'true' : 'false'}">${name}</label>
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
  #filterChange = null;

  constructor(filters, isChecked, filterChange) {
    super();
    this.#filters = filters;
    this.#isChecked = isChecked;
    this.#filterChange = filterChange;

    this.element.addEventListener('click', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#isChecked);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName === 'LABEL' && evt.target.dataset.disabled === 'false') {
      this.#filterChange(evt.target.dataset.name);
    }
  };
}

