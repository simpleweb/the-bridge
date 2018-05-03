_crawlHelper = require('../helpers/crawlHelper')

exports.index = async (req, res, next) => {
  try {
    var cookie = null;
    var before = null;

    if (req.query.get_posts_before !== undefined) {
      before = new Date(req.query.get_posts_before);
    } else {
      before = new Date();
    }

    // Create cookie with start date
    var date = new Date();
    res.cookie('get_posts_since', date.toISOString());

    var options = {
      get_posts_since: req.query.get_posts_since,
      get_posts_before: before.toISOString()
    };

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
