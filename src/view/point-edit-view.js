import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateAndTime } from '../utils.js';
import { TYPES_POINT } from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const renderPictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result = `${result}<img class="event__photo" src="${picture['src']}" alt="${picture.description}">`;
  });
  return result;
};

const renderNames = (destinations) => {
  let result = '';
  destinations.forEach((destination) => {
    result = `${result}
    <option value="${destination.name}"></option>`;
  });
  return result;
};

const renderOffers = (offers, checkedOffers) => {
  let result = '';
  offers.forEach((offer) => {
    const checked = checkedOffers.includes(offer.id) ? 'checked' : '';
    result = `${result}<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  });
  return result;
};

const renderDate = (dateFrom, dateTo) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateAndTime(dateFrom)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateAndTime(dateTo)}">
  </div>`
);

const renderType = (currentType) => TYPES_POINT.map((type) => `<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label></div>`)
  .join('');

const createPointEditTemplate = (point, destinations, offers) => {
  const { basePrice, type, destinationId, dateFrom, dateTo, offerIds } = point;
  const offersByType = offers.find((offer) => offer.type === type);

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${renderType(type)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-${destinationId}">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${destinationId}" type="text" name="event-destination" value="${destinations[destinationId].name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${renderNames(destinations)}
        </datalist>
      </div>
      ${renderDate(dateFrom, dateTo)}
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${renderOffers(offersByType.offers, offerIds)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinations[destinationId].description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${renderPictures(destinations[destinationId].pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`);
};

export default class PointEditView extends AbstractStatefulView {
  constructor(point, destinations, offers) {
    super();
    this._state = PointEditView.parsePointToState(point);
    this._destinations = destinations;
    this._offers = offers;
    this.#setInnerHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this._destinations, this._offers);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  _formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(PointEditView.parseStateToPoint(this._state));
  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this._buttonClickHandler);
  }

  _buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => {
    const point = {...state};
    return point;
  }

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offerIds: [],
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this._destination.filter((d) => d.name === evt.target.value);
    this.updateElement({
      destinationId: destination[0].id,
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    if (this._state.offerIds.includes(Number(evt.target.id.slice(-1)))) {
      this._state.offerIds = this._state.offerIds.filter((n) => n !== Number(evt.target.id.slice(-1)));
    }
    else {
      this._state.offerIds.push(Number(evt.target.id.slice(-1)));
    }
    this.updateElement({
      offerIds: this._state.offerIds,
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
  };

  reset = (point) => {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseClickHandler(this._callback.closeClick);
  };
}
