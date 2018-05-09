const cheerio = require("cheerio")

const htmlHelper = class HtmlHelper {
  constructor(responseBuffer) {
    this.$ = cheerio.load(responseBuffer.toString());
  }

  likeAndReactSpans() {
    let $ = this.$;

    return $('span').filter(function()  {
      return $(this).text().trim().match(/Like.+React/) !== null;
    });
  }

  getArticles() {
    return this.likeAndReactSpans().map(function() {
      return $(this).parent().parent().parent();
    });
  }

  getProfileName() {
    return this.$('#m-timeline-cover-section strong');
  }
}

module.exports = htmlHelper;