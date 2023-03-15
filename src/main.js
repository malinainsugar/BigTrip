import { render, RenderPosition} from './render';
import Filter from './view/filter';
import Trip from './presenter/trip';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripPresenter = new Trip({container : tripContainer});

render(new Filter(), filterContainer, RenderPosition.BEFOREEND);
tripPresenter.init();
