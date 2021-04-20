import AbstractView from './abstract-view';

export const createFilmsTemplate = () => {
  return '<section class="films"></section>';
};

export default class Films extends AbstractView {
  getTemplate() {
    return createFilmsTemplate();
  }
}
