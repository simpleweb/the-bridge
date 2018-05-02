const dateHelper = require('../helpers/date');
const $ = require("cheerio");

const post = class Post {
  constructor(name, article) {
    let user = $(article)
      .find('h3 a')
      .first()
      .text();

    if (name !== user) {
      user = user + ' (w/ ' + name + ')';
    }

    const content = $(article).find('p').text();
    const timestamp = dateHelper.convertFacebookDate($(article).find('abbr').text());

    this.user = user;
    this.content = content;
    this.timestamp = timestamp;
  }
};

module.exports = post;