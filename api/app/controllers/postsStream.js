const _crawlHelper = require('../helpers/crawlHelper')
const dateHelper = require('../helpers/date')
const url = require('url')
const environment_config = require("../../config/environments/config")

var payload
var crawlHelper

exports.index = async (ws, request) => {
  console.log('web socket connection established')

  const options = _crawlHelper.buildOptions(url.parse(request.url).query, null);
  crawlHelper = new _crawlHelper(options)

  crawlHelper.crawler.on("complete", () => {
    console.log('lookup complete')

    payload = JSON.stringify({
      posts: crawlHelper.posts.sort(),
      got_posts_since: crawlHelper.get_posts_since,
      got_posts_before: crawlHelper.get_posts_before
    })

    ws.send(payload, sendUpdateCallback)
  });

  await crawlHelper.login()
  crawlHelper.crawler.start()
};

sendUpdateCallback = (error) => {
  if (error) {
    console.log('connection lost')
  } else {
    setTimeout(() => {
      crawlHelper.reset({get_posts_before: dateHelper.isoNow(), get_posts_since: crawlHelper.get_posts_before})
      crawlHelper.crawler.start();
    }, environment_config.intervalBetweenLookups)
  }
}
