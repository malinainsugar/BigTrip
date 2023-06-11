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

  #dataChange = null;
  #modeChange = null;
  #mode = Mode.DEFAULT;

  #destinations = null;
  #offers = null;

  constructor ({pointListContainer, dataChange, modeChange, destinations, offers}) {
    this.#tripListComponent = pointListContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#dataChange = dataChange;
    this.#modeChange = modeChange;
  }

  init = (point) => {
    this.#point = point;

    const previousPointComponent = this.#pointComponent;
    const previousPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView ({
      point: point,
      destinations: this.#destinations,
      offersByType: this.#offers,
      editClick: this.#handleEditClick,
      favoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView ({
      point: this.#point,
      destinations: this.#destinations,
      offersByType: this.#offers,
      saveClick: this.#handleSaveForm,
      closeClick: this.#handleCloseForm,
      deleteClick: this.#handleDeletePoint
    });

    if (previousPointComponent === null || previousPointEditComponent === null) {
      render(this.#pointComponent, this.#tripListComponent);
      return;
    }

    switch (this.#mode) {
      case Mode.DEFAULT:
        replace(this.#pointComponent, previousPointComponent);
        break;
      case Mode.EDITING:
        replace(this.#pointEditComponent, previousPointEditComponent);
        this.#mode = Mode.DEFAULT;
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
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#modeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
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

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    const resetFromState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFromState);
  };

  #handleDeletePoint = (point) => this.#dataChange(UserAction.DELETE_POINT, UpdateType.MAJOR, point);

  #handleEditClick = () => this.#replacePointToForm();

  #handleFavoriteClick = () => {
    this.#dataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleSaveForm = (update) => {
    this.#dataChange(UserAction.UPDATE_POINT, UpdateType.MAJOR, update);
    this.#replaceFormToPoint();
  };

  #handleCloseForm = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  }
}

