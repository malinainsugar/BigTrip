import AbstractView from '../framework/view/abstract-view.js';
import { SortType, SortTypeDescription } from '../const.js';

const DISABLED_SORT_TYPES = [SortType.EVENT, SortType.OFFERS];

const createSortTemplate = (currentSortType) => `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
${Object.values(SortType).map((sortType) => `<div class="trip-sort__item  trip-sort__item--${sortType}">
    <input ${currentSortType === sortType ? 'checked' : ''} data-sort-type=${sortType} id="sort-${sortType}"
    class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}"
    ${DISABLED_SORT_TYPES.includes(sortType) ? 'disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${sortType}">${SortTypeDescription[sortType]}</label>
  </div>`).join('')}</form>`;


export default class SortView extends AbstractView {
  #isChecked = null;
  #buttonClick = null;

  constructor(isChecked, buttonClick) {
    super();
    this.#isChecked = isChecked;
    this.#buttonClick = buttonClick;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#isChecked);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#buttonClick(evt.target.dataset.sortType);
  };
}

