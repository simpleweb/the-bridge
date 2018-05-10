const _crawlHelper = require('../helpers/crawlHelper')
const dateHelper = require('../helpers/date')
const urlHelper = require('../helpers/url')
const environment_config = require("../../config/environments/config")

exports.index = async (ws, request) => {
  console.log('web socket connection established')

  var options = _crawlHelper.buildOptions(urlHelper.extractTimestampParams(request.url), null);
  var crawlHelper = new _crawlHelper(options)

  ws.on('close', () => {
    console.log('disconnected')
    crawlHelper.crawler.stop(true)
    crawlHelper = null;
  })

  crawlHelper.crawler.on("complete", () => {
    console.log('lookup complete')

    payload = JSON.stringify({
      posts: crawlHelper.posts.sort(),
      got_posts_since: crawlHelper.get_posts_since,
      got_posts_before: crawlHelper.get_posts_before
    })

    ws.send(payload, (error) => {
      if (error) {
        console.log('connection lost')
      } else {
        setTimeout(() => {
          if (crawlHelper) {
            crawlHelper.reset({get_posts_before: dateHelper.isoNow(), get_posts_since: crawlHelper.get_posts_before})
            crawlHelper.crawler.start();
          }
        }, environment_config.intervalBetweenLookups)
      }
    })
  });

  await crawlHelper.login()
  crawlHelper.crawler.start()
};
