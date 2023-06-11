import { RenderPosition, remove, render } from '../framework/render';
import { UpdateType, UserAction } from '../const';
import PointEditView from '../view/point-edit-view';

export default class PointNewPresenter {
  #newPointContainer = null;
  #newPointComponent = null;

  #changeData = null;
  #destroyCallback = null;

  #destinations = null;
  #offers = null;

  constructor({newPointContainer, changeData, pointsModel, destroyCallback}) {
    this.#newPointContainer = newPointContainer;
    this.#changeData = changeData;
    this.#destinations = pointsModel.destinations;
    this.#offers = pointsModel.offers;
    this.#destroyCallback = destroyCallback;
  }

  init = () => {

    if (this.#newPointComponent !== null) {
      return;
    }

    this.#newPointComponent = new PointEditView({
      destinations: this.#destinations,
      offersByType: this.#offers,
      saveClick: this.#handleSaveClick,
      deleteClick: this.#handleCloseClick,
      closeClick: this.#handleCloseClick,
    });

    render(this.#newPointComponent, this.#newPointContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#newPointComponent === null) {
      return;
    }

    this.#destroyCallback();
    remove(this.#newPointComponent);
    this.#newPointComponent = null;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleCloseClick = () => {
    this.destroy();
  };

  #handleSaveClick = (point) => {
    this.#changeData(UserAction.ADD_POINT, UpdateType.MAJOR, point);
  };

  setSaving = () => {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFromState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#newPointComponent.shake(resetFromState);
  };

}

