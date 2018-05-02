_crawlHelper = require('../helpers/crawlHelper')

exports.index = async (req, res, next) => {
  try {
    var crawlHelper = new _crawlHelper({get_posts_since: req.query.get_posts_since})

    await crawlHelper.login()

    crawlHelper.crawler.on("complete", () => {
      console.log("complete")

      res.render("posts/index", {
        data: crawlHelper.posts.sort()
      });
    });

    crawlHelper.crawler.start();
  } catch(error) {
    next(error)
  }
};
