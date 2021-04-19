import AbstractView from './abstract-view';

export default class AbstractFilmsListView extends AbstractView{
  getContainer() {
    return this._element.querySelector('.films-list__container');
  }
}
