import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import he from 'he';


const renderOffers = (allOffers, checkedOffers) => {
  if (!allOffers) {
    return '';
  }

  let result = '';
  allOffers.offers.forEach((offer) => {
    if (checkedOffers.includes(offer.id)) {
      result = `${result}<li class="event__offer"><span class="event__offer-title">${offer.title}</span>&plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span></li>`;
    }
  });
  return result;
};

const createPointTemplate = (point, destinations, allOffers) => {
  const { basePrice, type, destination, isFavorite, dateFrom, dateTo, offers } = point;
  const getDate = (date) => dayjs(date).format('D MMMM');
  const getTime = (date) => dayjs(date).format('hh:mm');
  const offersByType = allOffers.find((offer) => offer.type === type);
  const destinationData = destinations.find((item) => item.id === destination);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom}">${getDate(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
      </div>
      <h3 class="event__title">${type} ${destinationData ? he.encode(destinationData.name) : ''}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${(getDate(dateTo) === (getDate(dateFrom)) ? getTime(dateFrom) : getDate(dateFrom))}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${(getDate(dateTo) === (getDate(dateFrom)) ? getTime(dateTo) : getDate(dateTo))}</time>
        </p>
        <p class="event__duration">30M</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          ${renderOffers(offersByType, offers)}
        </li>
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
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

export default class PointView extends AbstractView {

  #point = null;
  #destinations = null;
  #offers = null;

  constructor(point, destinations, offers) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offers);
  }

  setEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}

