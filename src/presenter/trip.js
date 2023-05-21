import { render, replace } from '../framework/render.js';
import Point from '../view/point';
import PointEdit from '../view/point-edit';
import Sort from '../view/sort';
import TripList from '../view/trip-list';
import EmptyList from '../view/empty-list';

class Trip {
  constructor() {
    this._tripListComponent = new TripList();
  }

  init(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._listPoints = this._pointsModel.points;

    if (this._listPoints.length === 0) {
      return render(new EmptyList(), this._container);
    }

    render(new Sort(), this._container);
    render(this._tripListComponent, this._container);

    for (let i = 0; i < this._listPoints.length; i++) {
      this._renderPoint(this._listPoints[i]);
    }
  }

  _renderPoint (point) {
    const pointComponent = new Point(point);
    const pointEditComponent = new PointEdit(point);

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setButtonClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    return render(pointComponent, this._tripListComponent.element);
  }
}

export default Trip;

