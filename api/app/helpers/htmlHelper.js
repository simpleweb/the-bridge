const cheerio = require("cheerio")

const htmlHelper = class HtmlHelper {
  constructor(responseBuffer) {
    this.$ = cheerio.load(responseBuffer.toString('utf8'));
  }

  likeAndReactSpans() {
    let $ = this.$;

    return $('span').filter(function()  {
      let interactionText = $(this).text().trim().match(/Like.+React/);
      return interactionText !== null;
    });
  }

  getArticles() {
    let $ = this.$;
    let index = 2;

    return this.likeAndReactSpans().map(function() {
      return $(this)
        .parents()
        .eq(index);
    });
  }

  getDateFromArticle() {
    return this.$('abbr');
  }

  getUserFromArticle() {
    let $ = this.$;
    return this
      .$('h3 a')
      .first();
  }

  getContentFromArticle() {
    return this.$('p');
  }

  getProfileName() {
    return this.$('#m-timeline-cover-section strong');
  }

  getUrlsFromLinks() {
    let $ = this.$;

    return $("a[href]").map(function () {
      return $(this).attr("href");
    });
  }
}

module.exports = htmlHelper;