import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './api-services/points-api-service.js';

const AUTHORIZATION = 'Basic 48gh589hfdg49grr';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const mainElement = document.querySelector('.page-main');
const menuContainer = document.querySelector('.trip-main');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(menuContainer.querySelector('.trip-controls__filters'), filterModel, pointsModel);
const tripPresenter = new TripPresenter(mainElement.querySelector('.trip-events'), pointsModel, filterModel);
const newPointButtonComponent = new NewPointButtonView();

const newPointFormCloseHandle = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(newPointFormCloseHandle);
  newPointButtonComponent.element.disabled = true;
};

filterPresenter.init();
tripPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, menuContainer);
    newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
  });
