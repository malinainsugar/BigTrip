import { render } from '../render';
import Point from '../view/point';
import PointEdit from '../view/point-edit';
import PointNew from '../view/point-new';
import Sort from '../view/sort';
import TripList from '../view/trip-list';

class Trip {
  constructor() {
    this.component = new TripList();
  }

  init(container, pointsModel) {
    this.container = container;
    this.pointsModel = pointsModel;
    this.listPoints = this.pointsModel.getPoints();

    render(new Sort(), this.container);
    render(this.component, this.container);
    render(new PointNew(), this.component.getElement());
    render(new PointEdit(this.listPoints[0]), this.component.getElement());

    for (let i = 0; i < this.listPoints.length; i++) {
      render(new Point(this.listPoints[i]), this.component.getElement());
    }
  }
}

export default Trip;

