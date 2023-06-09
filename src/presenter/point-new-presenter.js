import { RenderPosition, remove, render } from '../framework/render';
import { UpdateType, UserAction } from '../const';
import PointEditView from '../view/point-edit-view';
import { nanoid } from 'nanoid';

export default class PointNewPresenter {
  #pointListContainer = null;
  #editingPointComponent = null;
  #changeData = null;
  #destroyCallback = null;
  #pointsModel = null;
  #destinations = null;
  #offers = null;
  #isNewPoint = true;

  constructor(pointListContainer, changeData, pointsModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editingPointComponent !== null) {
      return;
    }
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    this.#editingPointComponent = new PointEditView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: this.#isNewPoint
    });

    this.#editingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editingPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#editingPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editingPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#editingPointComponent);
    this.#editingPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };
}

