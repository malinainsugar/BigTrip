import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateAndTime } from '../utils.js';
import { TYPES_POINT } from '../const.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destinationId: 0,
  id: 0,
  isFavorite: false,
  offersIds: [],
  type: TYPES_POINT[0],
};

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

const createPointEditTemplate = (point, destinations, offers, isNewPoint) => {
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
        <input class="event__input  event__input--destination" id="event-destination-${destinationId}" type="text" name="event-destination" value="${ isNewPoint ? '' : he.encode(destinations[destinationId].name)}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${isNewPoint ? '' : renderNames(destinations)}
        </datalist>
      </div>
      ${renderDate(dateFrom, dateTo)}
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      ${isNewPoint ? '<button class="event__reset-btn" type="reset">Cancel</button>' :
      `<button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">`}
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${isNewPoint ? '' : renderOffers(offersByType.offers, offerIds)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${isNewPoint ? '' : destinations[destinationId].description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${isNewPoint ? '' : renderPictures(destinations[destinationId].pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`);
};

export default class PointEditView extends AbstractStatefulView {
  #datepickerFrom = null;
  #datepickerTo = null;
  #destinations = null;
  #offers = null;
  #isNewPoint = null;

  constructor({point = BLANK_POINT, destinations, offers, isNewPoint}) {
    super();
    this._state = PointEditView.parsePointToState(point);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#isNewPoint = isNewPoint;
    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations, this.#offers, this.#isNewPoint);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseStateToPoint(this._state));
  };

  setFormSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit(PointEditView.parseStateToPoint(this._state));
  }

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonClickHandler);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  static parsePointToState = (point) => ({...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate()
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    return point;
  }

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._state.offerIds = [];
    this.updateElement({
      type: evt.target.value,
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destinations.find((d) => d.name === evt.target.value);
    this.updateElement({
      destinationId: destination.id,
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = Number(evt.target.id.slice(-1));
    const offerIds = this._state.offerIds.filter((n) => n !== offerId);
    let currentOfferIds = [...this._state.offerIds];
    if (offerIds.length !== this._state.offerIds.length) {
      currentOfferIds = offerIds;
    }
    else {
      currentOfferIds.push(offerId);
    }
    this._setState({
      offerIds: currentOfferIds,
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: `${Number(evt.target.value).toString()}`,
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
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
    this.#setOuterHandlers();
  };

  #setOuterHandlers = () => {
    if (!this.#isNewPoint) {
      this.setCloseClickHandler(this._callback.closeClick);
    }
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };


  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: dayjs(userDate).toDate(),
    });
  };

  #setDatepickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#dateFromChangeHandler,
        },
      );
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: dayjs(userDate).toDate(),
    });
  };

  #setDatepickerTo = () => {
    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  };
}
