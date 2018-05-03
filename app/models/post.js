const dateHelper = require('../helpers/date');
const $ = require("cheerio");

const post = class Post {
  constructor(user, content, timestamp) {
    this.user = user;
    this.content = content;
    this.timestamp = timestamp;
    this.prettyTimestamp = dateHelper.prettyFormatRawDate(timestamp)
  }

  static CreatePost(name, article, before, since) {
    const timestamp = dateHelper.convertFacebookDate($(article).find('abbr').text());

    if (!dateHelper.isBefore(timestamp, before) || !dateHelper.isAfter(timestamp, since)) {
      return null;
    }

    let user = $(article)
      .find('h3 a')
      .first()
      .text();

    if (name !== user) {
      user = user + ' (w/ ' + name + ')';
    }

    const content = $(article).find('p').text();

    return new Post(user, content, timestamp);
  }
};

module.exports = post;