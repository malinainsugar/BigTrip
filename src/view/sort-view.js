import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortTemplate = (isChecked) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input ${isChecked === SortType.DAY ? 'checked' : ''} data-sort-type=${SortType.DAY} id="sort-${SortType.DAY}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.DAY}" checked>
      <label class="trip-sort__btn" for="sort-day" data-sort-type="${SortType.DAY}">Day</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--event">
      <input ${isChecked === SortType.EVENT ? 'checked' : ''} data-sort-type=${SortType.EVENT} id="sort-${SortType.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.EVENT}" disabled>
      <label class="trip-sort__btn" for="sort-event" data-sort-type="${SortType.EVENT}">Event</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--time">
      <input ${isChecked === SortType.TIME ? 'checked' : ''} data-sort-type=${SortType.TIME} id="sort-${SortType.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.TIME}">
      <label class="trip-sort__btn" for="sort-time" data-sort-type="${SortType.TIME}">Time</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--price">
      <input ${isChecked === SortType.PRICE ? 'checked' : ''} data-sort-type=${SortType.PRICE} id="sort-${SortType.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.PRICE}">
      <label class="trip-sort__btn" for="sort-price" data-sort-type="${SortType.PRICE}">Price</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--offer">
      <input ${isChecked === SortType.OFFER ? 'checked' : ''} data-sort-type=${SortType.OFFER} id="sort-${SortType.OFFER}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.OFFER}" disabled>
      <label class="trip-sort__btn" for="sort-offer" data-sort-type="${SortType.OFFERS}">Offers</label>
    </div>
  </form>`
);

export default class SortView extends AbstractView {
  #isChecked = null;

  constructor(isChecked) {
    super();
    this.#isChecked = isChecked;
  }

  get template() {
    return createSortTemplate(this.#isChecked);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.dataset.sortType) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}

