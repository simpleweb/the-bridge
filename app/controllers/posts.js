_crawlHelper = require('../helpers/crawlHelper')

exports.index = async (req, res, next) => {
  try {
    var crawlHelper = new _crawlHelper

    await crawlHelper.login()

    crawlHelper.crawler.on("complete", () => {
      res.render("posts/index", {
        data: crawlHelper.posts.sort()
      });
    });

    crawlHelper.crawler.start();
  } catch(error) {
    next(error)
  }
};
