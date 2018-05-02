_crawlHelper = require('../helpers/crawlHelper')
crawlHelper = new _crawlHelper

exports.index = async (req, res, next) => {
  try {
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
