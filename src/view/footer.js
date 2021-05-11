import AbstractView from './abstract-view';
import {formatNumber} from '../utils/common';

export const createFooterTemplate = (totalFilmsQuantity) => {
  return `<footer class="footer">
  <section class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
  <p> ${formatNumber(totalFilmsQuantity)} movies inside</p>
  </section>
</footer>`;
};

export default class Footer extends AbstractView{
  constructor(totalFilms) {
    super();
    this._element = null;
    this._totalFilmsQuantity = totalFilms;
  }

  getTemplate() {
    return createFooterTemplate(this._totalFilmsQuantity);
  }
}
