import Observer from '../utils/observer.js';

export default class CommentsModel extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  deleteComment(id) {
    this._comments = this._comments.filter((comment) => comment.id !== id);
  }
}
