const _crawlHelper = require('../helpers/crawlHelper')
const dateHelper = require('../helpers/date')
const url = require('url')
var crawlHelper

exports.index = async (ws, request) => {
  console.log('web socket connection established')

  const options = _crawlHelper.buildOptions(url.parse(request.url).query, null);
  crawlHelper = new _crawlHelper(options)

  crawlHelper.crawler.on("complete", () => {
    console.log('lookup complete')

    ws.send(JSON.stringify({
      posts: crawlHelper.posts.sort(),
      got_posts_since: crawlHelper.get_posts_since,
      got_posts_before: crawlHelper.get_posts_before
    }))

    setTimeout(() => {
      crawlHelper.reset({get_posts_before: dateHelper.isoNow(), get_posts_since: crawlHelper.get_posts_before})
      crawlHelper.crawler.start();
    }, 5000)
  });

  await crawlHelper.login()
  crawlHelper.crawler.start()
};
