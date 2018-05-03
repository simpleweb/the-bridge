_crawlHelper = require('../helpers/crawlHelper')

exports.index = async (req, res, next) => {
  try {
    var cookie = req.cookies.get_posts_since;
    var before = null;
    var since = null;

    if (req.query.get_posts_before !== undefined) {
      before = new Date(req.query.get_posts_before);
    } else {
      before = new Date();
    }

    if (req.query.get_posts_since !== undefined) {
      since = new Date(req.query.get_posts_since);
    } else if (cookie !== undefined) {
      since = new Date(cookie);
    } else {
      since = new Date(new Date().getFullYear(), 0, 1)
    }

    // Create cookie with start date
    var date = new Date();
    res.cookie('get_posts_since', before.toISOString());

    var options = {
      get_posts_since: since.toISOString(),
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
