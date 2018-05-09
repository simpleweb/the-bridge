const dateHelper = require('../helpers/date');
const HtmlHelper = require('../helpers/htmlHelper');

const post = class Post {
  constructor(user, content, timestamp) {
    this.user = user;
    this.content = content;
    this.timestamp = timestamp;
    this.prettyTimestamp = dateHelper.prettyFormatRawDate(timestamp)
  }

  static CreatePost(name, article, before, since) {
    const htmlHelper = new HtmlHelper(article);

    const timestamp = dateHelper.convertFacebookDate(htmlHelper.getDateFromArticle().text());

    if (!dateHelper.isBefore(timestamp, before) || !dateHelper.isAfter(timestamp, since)) {
      return null;
    }

    let user = htmlHelper
      .getUserFromArticle()
      .text();

    if (name !== user) {
      user = user + ' (w/ ' + name + ')';
    }

    const content = htmlHelper
      .getContentFromArticle()
      .text();

    if (content === null || !content) {
      return null;
    }

    return new Post(user, content, timestamp);
  }
};

module.exports = post;