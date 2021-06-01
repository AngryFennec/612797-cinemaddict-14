export default class Store {
  constructor(name, storage) {
    this._storage = storage;
    this._storeName = name;
    this._filmsKey = `${this._storeName}-films`;
    this._commentsKey = `${this._storeName}-comments`;
  }

  getFilmsKey() {
    return this._filmsKey;
  }

  getCommentsKey() {
    return this._commentsKey;
  }

  getItems(key) {
    try {
      return JSON.parse(this._storage.getItem(key)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(key, items) {
    this._storage.setItem(
      key,
      JSON.stringify(items),
    );
  }

  setItem(key, itemKey, value) {
    const store = this.getItems(key);
    this._storage.setItem(
      key,
      JSON.stringify(
        Object.assign({}, store, {
          [itemKey]: value,
        }),
      ),
    );
  }

  removeItem(key, itemKey, id) {
    const store = this.getItems(key);
    if (id) {
      const comments = store[itemKey];
      store[itemKey] = comments.filter((item) => item.id !== id);
    } else {
      delete store[itemKey];
    }

    this._storage.setItem(
      key,
      JSON.stringify(store),
    );
  }
}
