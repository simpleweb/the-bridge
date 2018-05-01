const $ = require("cheerio");

const postCollection = class PostCollection {
  constructor() {
    this.store = [];
  }

  sort(array) {
    return array.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }

  addPosts(name, articles) {
    let postStore = this.store;

    articles.each(function(i, elem) {
      let user = $(elem)
        .find('h3 a')
        .first()
        .text();

      if (name !== user) {
        user = user + ' (with ' + name + ')'
      }

      // TODO: Use helper to parse timestamp
      const timestamp = $(elem).find('abbr').text();
      const content = $(elem).find('p').text();

      // TODO Add JSON to model
      postStore.push({
        'user': user,
        'content': content,
        'timestamp': timestamp
      });
    });

    this.sort(this.store);
  }

  renderPosts() {
    console.log('Items in collection: ' + JSON.stringify(this.store));
  }
};

module.exports = postCollection;