import Abstract from './abstract';

export const createFilmsTemplate = () => {
  return '<section class="films"></section>';
};

export default class Films extends Abstract {
  getTemplate() {
    return createFilmsTemplate();
  }
}
