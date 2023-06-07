import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const createPointTemplate = (point) => {
  const getDate = (date) => dayjs(date).format('D MMMM');
  const getTime = (date) => dayjs(date).format('hh:mm');
  const { offers, destination } = point;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${getDate(point.dateTo)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${point.type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${point.dateFrom}">${(getDate(point.dateTo) === (getDate(point.dateFrom)) ? getTime(point.dateFrom) : getDate(point.dateFrom))}</time>
          &mdash;
          <time class="event__end-time" datetime="${point.dateTo}">${(getDate(point.dateTo) === (getDate(point.dateFrom)) ? getTime(point.dateTo) : getDate(point.dateTo))}</time>
        </p>
        <p class="event__duration">30M</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          <span class="event__offer-title">${offers[0].title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offers[0].price}}</span>
        </li>
      </ul>
      <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
  }

  get template() {
    return createPointTemplate(this._point);
  }

  setEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  _editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  _favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}

