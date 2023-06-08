import { render, replace, remove } from '../framework/render';
import PointView  from '../view/point-view';
import PointEditView  from '../view/point-edit-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  constructor (tripList, points, changeData, modeChange) {
    this._tripListComponent = tripList;
    this._pointsModel = points;
    this._changeData = changeData;
    this._handleModeChange = modeChange;
    this._mode = Mode.DEFAULT;
    this._pointComponent = null;
    this._pointEditComponent = null;
  }

  init = (point) => {
    this._point = point;
    this._destinations = [...this._pointsModel.destinations];
    this._offers = [...this._pointsModel.offers];

    const previousPointComponent = this._pointComponent;
    const previousPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView (this._point, this._destinations, this._offers);
    this._pointEditComponent = new PointEditView (this._point, this._destinations, this._offers);

    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._pointComponent.setEditClickHandler(this._handleEditSubmitClick);

    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmitClick);

    this._pointEditComponent.setCloseClickHandler(this._handleCloseClick);

    if (previousPointComponent === null || previousPointEditComponent === null) {
      render(this._pointComponent, this._tripListComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, previousPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, previousPointEditComponent);
    }

    remove(previousPointComponent);
    remove(previousPointEditComponent);
  }

  destroy = () => {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView = () => {
    if (this._mode !== Mode.DEFAULT) {
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm = () => {
    this._handleModeChange();
    this._mode = Mode.EDITING;
    replace(this._pointEditComponent, this._pointComponent);
  }

  _replaceFormToPoint = () => {
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  }

  _handleEditSubmitClick = () => {
    this._replacePointToForm(this._points);
    document.addEventListener('keydown', this._onEscKeyDown);
  }

  _handleFavoriteClick = () => this._changeData({...this._point, isFavorite: !this._point.isFavorite});

  _handleFormSubmitClick = () => {
    this._replaceFormToPoint();
    this._changeData(this._point);
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _handleCloseClick = () => {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }
}

