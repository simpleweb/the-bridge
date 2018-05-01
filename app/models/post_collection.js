const cheerio = require("cheerio");

const postCollection = class PostCollection {
  constructor() {
    this.store = [];
  }

  sort(array) {
    return array.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }

  addPosts(posts) {
    this.store.push(posts);
    this.sort(this.store);
  }

  renderPosts() {
    console.log('Items in collection: ' + JSON.stringify(this.store));
  }
};

module.exports = postCollection;