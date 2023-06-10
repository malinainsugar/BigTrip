import { render, replace, remove } from '../framework/render';
import { UserAction, UpdateType } from '../const.js';
import PointView  from '../view/point-view';
import PointEditView  from '../view/point-edit-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {

  #tripListComponent = null;
  #point = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #dataChange = null;
  #modeChange = null;
  #mode = Mode.DEFAULT;

  #destinations = null;
  #offers = null;

  constructor ({tripList, pointsModel, dataChange, modeChange, destinationsModel, offersModel}) {
    this.#tripListComponent = tripList;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#dataChange = dataChange;
    this.#modeChange = modeChange;
  }

  init = (point) => {
    this.#point = point;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    const previousPointComponent = this.#pointComponent;
    const previousPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView (this.#point, this.#destinations, this.#offers);
    this.#pointEditComponent = new PointEditView ({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: false
    });

    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#pointComponent.setEditClickHandler(this.#handleEditSubmitClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmitClick);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseClick);
    this.#pointEditComponent.setResetClickHandler(this.#handleResetClick);

    if (previousPointComponent === null || previousPointEditComponent === null) {
      render(this.#pointComponent, this.#tripListComponent);
      return;
    }

    switch (this.#mode) {
      case Mode.DEFAULT:
        replace(this.#pointComponent, previousPointComponent);
        break;
      case Mode.EDITING:
        replace(this.#pointComponent, previousPointComponent);
        break;
    }

    remove(previousPointComponent);
    remove(previousPointEditComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm = () => {
    this.#modeChange();
    this.#mode = Mode.EDITING;
    replace(this.#pointEditComponent, this.#pointComponent);

  }

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #handleEditSubmitClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #handleFavoriteClick = () => {
    this.#dataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleFormSubmitClick = () => {
    this.#replaceFormToPoint();
    this.#dataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, this.#point);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #handleCloseClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #handleResetClick = () => {
    this.resetView();
  };
}

