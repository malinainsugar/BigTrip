import { render } from '../render';
import Point from '../view/point';
import PointEdit from '../view/point-edit';
import Sort from '../view/sort';
import TripList from '../view/trip-list';
import EmptyList from '../view/empty-list';

class Trip {
  constructor() {
    this._component = new TripList();
  }

  init(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._listPoints = this._pointsModel.points;

    if (this._listPoints.length === 0) {
      return render(new EmptyList(), this._container);
    }

    render(new Sort(), this._container);
    render(this._component, this._container);

    for (let i = 0; i < this._listPoints.length; i++) {
      this._renderPoint(this._listPoints[i]);
    }
  }

  _renderPoint (point) {
    const pointComponent = new Point(point);
    const pointEditComponent = new PointEdit(point);

    const replaceFormToPoint = () => {
      this._component.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const replacePointToForm = () => {
      this._component.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const onSaveButtonClick = (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      pointEditComponent.element.removeEventListener('submit', onSaveButtonClick);
    };

    const onRollupButtonClick = () => {
      replaceFormToPoint();
      pointEditComponent.element.removeEventListener('click', onRollupButtonClick);
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
      pointEditComponent.element.querySelector('form').addEventListener('submit', onSaveButtonClick);
      pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', onRollupButtonClick);
    });

    return render(pointComponent, this._component.element);
  }
}

export default Trip;

