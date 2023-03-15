import { render, RenderPosition} from '../render';
import Point from '../view/point';
import PointEdit from '../view/point-edit';
import PointNew from '../view/point-new';
import Sort from '../view/sort';
import TripList from '../view/trip-list';

class Trip {
  constructor({container}) {
    this.component = new TripList();
    this.container = container;
  }

  init() {
    render(new Sort(), this.container, RenderPosition.BEFOREEND);
    render(this.component, this.container);
    render(new PointNew(), this.component.getElement(), RenderPosition.BEFOREEND);
    render(new PointEdit(), this.component.getElement(), RenderPosition.BEFOREEND);

    for (let i = 0; i < 3; i++) {
      render(new Point(), this.component.getElement(), RenderPosition.BEFOREEND);
    }
  }
}

export default Trip;
