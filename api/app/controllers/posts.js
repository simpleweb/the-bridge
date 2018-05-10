_crawlHelper = require('../helpers/crawlHelper')

exports.index = async (req, res, next) => {
  try {
    const options = _crawlHelper.buildOptions(req.query, req.cookies);
    // Create cookie with start date
    res.cookie(`get_posts_since_for_${options.user}`, options.get_posts_before)

    var crawlHelper = new _crawlHelper(options);

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
