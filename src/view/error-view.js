import AbsractView from '../framework/view/abstract-view';

const createErrorTemplate = () => '<p class="trip-events__msg">An error has occurred. Please try again later</p>';

export default class ErrorView extends AbsractView {
  get template() {
    return createErrorTemplate();
  }
}

