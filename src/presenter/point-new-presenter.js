import { RenderPosition, remove, render } from '../framework/render';
import { UpdateType, UserAction } from '../const';
import PointEditView from '../view/point-edit-view';

export default class PointNewPresenter {
  #pointListContainer = null;
  #creatingPointComponent = null;
  #changeData = null;
  #destroyCallback = null;

  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor({pointListContainer, changeData, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;

    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#creatingPointComponent !== null) {
      return;
    }

    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#creatingPointComponent = new PointEditView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });

    this.#creatingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#creatingPointComponent.setResetClickHandler(this.#handleResetClick);

    render(this.#creatingPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#creatingPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#creatingPointComponent);
    this.#creatingPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  setSaving = () => {
    this.#creatingPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    this.#creatingPointComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#creatingPointComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };
}

