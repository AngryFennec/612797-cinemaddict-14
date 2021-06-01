import AbstractView from './abstract-view';
import {getUserRank} from '../utils/common';


export const createProfileTemplate = (films) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(films)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class Profile extends AbstractView {

  constructor(films) {
    super();
    this._films = films.filter((item) => item.userDetails.alreadyWatched);
  }
  getTemplate() {
    return createProfileTemplate(this._films);
  }
}
