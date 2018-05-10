const Post = require('../models/post');

const postCollection = class PostCollection {
  constructor(before, since) {
    this._before = before;
    this._since = since;
    this._store = [];
  }

  sort() {
    let array = this._store;
    return array.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    return this._store;
  }

  addPosts(name, articles) {
    let postStore = this._store;
    let before = this._before;
    let since = this._since;

    articles.each(function(i, elem) {
      let post = Post.CreatePost(name, elem, before, since);

      if (post != null) {
        postStore.push(post);
      }
    });
  }

  renderPosts() {
    console.log(JSON.stringify(this._store));
  }
};

module.exports = postCollection;
