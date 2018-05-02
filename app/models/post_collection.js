const Post = require('../models/post');

const postCollection = class PostCollection {
  constructor() {
    this.store = [];
  }

  sort() {
    let array = this.store;
    return array.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }

  addPosts(name, articles) {
    let postStore = this.store;

    articles.each(function(i, elem) {
      postStore.push(new Post(name, elem));
    });
  }

  renderPosts() {    
    console.log(JSON.stringify(this.store));
  }
};

module.exports = postCollection;