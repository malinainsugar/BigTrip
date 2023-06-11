import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateAndTime, isFirstDateBeforeSecond } from '../utils.js';
import { TYPES_POINT } from '../const.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 100,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: TYPES_POINT[0],
};

const renderPictures = (pictures) => pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const renderNames = (destinations) => destinations.length === 0 ? '' :
  destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');

const renderOffers = (offers, isDisabled) => {
  if (offers.length === 0) {
    return `
    <section class="event__section  event__section--offers">
      <div class="event__available-offers">
      </div>
    </section>`;
  }
  const offersTemplate = offers
    .map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" 
        id="event-offer-${offer.title}-1" type="checkbox" 
        name="event-offer-${offer.title}" ${offer.isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.title}" data-name="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
        </div>`
    ).join('');
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>`;
};

const renderDate = (dateFrom, dateTo, isDisabled) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateAndTime(dateFrom)} ${isDisabled ? 'disabled' : ''}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateAndTime(dateTo)} ${isDisabled ? 'disabled' : ''}">
  </div>`
);

const renderType = (currentType, isDisabled) => TYPES_POINT.map((type) => `<div class="event__type-item">
  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label></div>`)
  .join('');

const createPointEditTemplate = (point, destinations) => {
  const { basePrice, type, destination, dateFrom, dateTo, offers, isDisabled, isSaving, isDeleting, id } = point;

  const deleteButton = isDeleting ? 'Deleting...' : 'Delete';
  const rollUpButton =
  `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
    <span class="visually-hidden">Open event</span>
  </button>`;


  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${renderType(type, isDisabled)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-${destination}">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${destination}" type="text" name="event-destination" 
          value="${destination.name}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1">
          ${renderNames(destinations)}
        </datalist>
      </div>
      ${renderDate(dateFrom, dateTo, isDisabled)}
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
        ${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
        ${id ? deleteButton : 'Cancel'}</button>
        ${id ? rollUpButton : ''}
    </header>
    <section class="event__details">
    ${renderOffers(offers)}
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">'Destination'</h3>
        <p class="event__destination-description">${destination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${renderPictures(destination.pictures)}
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
  #offersByType = null;

  #saveClick = null;
  #closeClick = null;
  #deleteClick = null;

  constructor({point = BLANK_POINT, destinations, offersByType, saveClick, closeClick, deleteClick }) {
    super();

    this._state = PointEditView.parsePointToState(point, offersByType, destinations);
    this.#destinations = destinations;
    this.#offersByType = offersByType;

    this.#saveClick = saveClick;
    this.#closeClick = closeClick;
    this.#deleteClick = deleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations);
  }

  static parsePointToState = (point, offersByType, destinations) => ({
    ...point,
    offers: offersByType.find((offer) => offer.type === point.type).offers.map((offer) => ({...offer, isChecked: point.offers.includes(offer.id),})),
    destination: destinations.find((destination) => destination.id === point.destination),
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate(),
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state,
      destination: state.destination.id,
      offers: state.offers.filter((offer) => offer.isChecked).map((offer) => offer.id),};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  #pointTypeChangeHandler = (evt) => {
    const type = evt.target.value;
    this.updateElement({
      type: evt.target.value,
      offers: this.#offersByType.find((offer) => offer.type === type).offers.map((offer) => ({ ...offer, isChecked: false })),
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    const chosenDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    if (chosenDestination) {
      this.updateElement({
        destination: chosenDestination,
      });
    }
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.tagName === 'DIV') {
      return;
    }

    let offerId = evt.target.dataset.name;
    if (!offerId) {
      offerId = evt.target.parentNode.dataset.name;
    }

    offerId = parseInt(offerId, 10);
    const checkedOffer = this._state.offers.find((offer) => offer.id === offerId);

    checkedOffer.isChecked = !checkedOffer.isChecked;

    this.updateElement({
      offers: [...this._state.offers],
    });
  };

  #pointPriceChangeHandler = (evt) => {
    this._setState({
      price: evt.target.value,
      basePrice: Number(evt.target.value, 10),
    });
  };

  reset = (point) => {
    this.updateElement(PointEditView.parsePointToState(point, this.#offersByType, this.#destinations));
  };

  _restoreHandlers = () => {
    this.checkQuerySelector('.event__rollup-btn', 'click', this.#closeClickHandler);
    this.checkQuerySelector('.event__save-btn', 'click', this.#saveClickHandler);
    this.checkQuerySelector('.event__input--price', 'input', this.#pointPriceChangeHandler);
    this.checkQuerySelector('.event__type-group', 'change', this.#pointTypeChangeHandler);
    this.checkQuerySelector('.event__input--destination', 'blur', this.#pointDestinationChangeHandler);
    this.checkQuerySelector('.event__available-offers', 'click', this.#offersChangeHandler);
    this.checkQuerySelector('.event__reset-btn', 'click', this.#deleteClickHandler);
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  checkQuerySelector(event, action, handler) {
    const elem = this.element.querySelector(event);
    if (!elem){
      return;
    }
    return elem.addEventListener(action, handler);
  }


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
      dateFrom: userDate,
    });
  };

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr(this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.DateTo,
        onClose: this.#dateFromChangeHandler,
      },
    );
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerTo = () => {
    this.#datepickerTo = flatpickr(this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    if (this._state.basePrice > 0 && isFirstDateBeforeSecond(this._state.dateFrom, this._state.dateTo)) {
      this.#saveClick(PointEditView.parseStateToPoint(this._state));
    } else {
      this.shake();
    }
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#deleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#closeClick();
  };
}
