const _crawlHelper = require('../helpers/crawlHelper')
const dateHelper = require('../helpers/date')
const url = require('url')
var crawlHelper

exports.index = async (ws, request) => {
  console.log('web socket connection established')

  const options = _crawlHelper.buildOptions(url.parse(request.url).query, null);

  triggerCrawl(options, ws)
};

triggerCrawl = async (options, ws) => {
  crawlHelper = new _crawlHelper(options)

  await crawlHelper.login()

  crawlHelper.crawler.on("complete", () => {
    console.log('lookup complete')

    ws.send(JSON.stringify({
      posts: crawlHelper.posts.sort(),
      got_posts_since: options.get_posts_since,
      got_posts_before: options.get_posts_before
    }))

    triggerCrawl({get_posts_before: dateHelper.isoNow(), get_posts_since: options.get_posts_before}, ws)
  });

  crawlHelper.crawler.start();
}
