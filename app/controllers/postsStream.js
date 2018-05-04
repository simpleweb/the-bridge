const _crawlHelper = require('../helpers/crawlHelper')
const url = require('url')
var crawlHelper

exports.index = async (ws, request) => {
  console.log('web socket connection established')
  var get_posts_since = url.parse(request.url).query.get_posts_since

  triggerCrawl(get_posts_since, ws)
};

triggerCrawl = async (get_posts_since, ws) => {
  crawlHelper = new _crawlHelper({get_posts_since: get_posts_since})

  await crawlHelper.login()

  crawlHelper.crawler.on("complete", () => {
    console.log('lookup complete')

    ws.send(JSON.stringify(crawlHelper.posts.sort()))

    triggerCrawl(get_posts_since, ws)
  });

  crawlHelper.crawler.start();
}
