_crawlTracker = require('../helpers/crawlTracker')
crawlTracker = new _crawlTracker

var Crawler = require("simplecrawler"),
    url = require("url"),
    cheerio = require("cheerio"),
    request = require("request"),
    PostCollection = require('../models/post_collection')

var crawler = new Crawler('https://mbasic.facebook.com/friends/center/friends/')

crawler.respectRobotsTxt = false

crawler.discoverResources = (buffer, queueItem) => {
  $ = cheerio.load(buffer.toString("utf8"));

  timestamps = $('span').filter(function()  {
    return $(this).text().trim().match(/Like.+React/) !== null;
  }).map(function() {
    return $(this).parent().prev().find('abbr');
  })

  if (timestamps.length > 0) {
    // TO DO: ignore links if the final post on the page was sent earlier than the time from which we want to check more recent posts
    console.log(timestamps.last().text())
  }

  return $("a[href]").map(function () {
    return $(this).attr("href");
  }).get();
};

crawler.on("crawlstart", () => {
  console.log("Start");
});

crawler.on("complete", () => {
  console.log("Complete");
  posts.sort();
  posts.renderPosts();
});

// record a new page of friends has been loaded
crawler.on("queueadd", (queueItem, referrerQueueItem) => {
  if (queueItem.uriPath === '/friends/center/friends/') {
    crawlTracker.loadedMoreFriends()
  }
});

const posts = new PostCollection();

crawler.on("fetchcomplete", (queueItem, responseBuffer, response) => {
  if (queueItem.path.match(/[a-zA-Z.0-9?=&]+fref=hovercard/)) {
    const $ = cheerio.load(responseBuffer.toString());

    let name = $('.bm').text();
    
    let articles = $('span').filter(function()  {
      return $(this).text().trim().match(/Like.+React/) !== null;
    }).map(function() {
      return $(this).parent().parent().parent();
    });

    posts.addPosts(name, articles);

    console.log("Fetched", queueItem.url);
  }
});

// only queue friend hovercards, profiles, friend lists
crawler.addFetchCondition( (queueItem, referrerQueueItem, callback) => {
  hovercard = queueItem.uriPath === '/friends/hovercard/mbasic/'
  profile = queueItem.path.match(/[a-zA-Z.0-9?=&]+fref=hovercard/) !== null
  loadMoreFriends = (queueItem.uriPath === '/friends/center/friends/') && (!crawlTracker.atFriendsLoadedLimit())
  // we also want to go to 'Show More' posts pages - if the crawler identifies such a link, which will only be if we need to go further back in time

  callback(null, hovercard || profile || loadMoreFriends);
});

exports.index = async (req, res, next) => {
  request('https://mbasic.facebook.com/login.php', {
    headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'},
    jar: true
  }, login);

  try {
    res.render("posts/index", {
      data: [{sender: 'test_sender', timestamp: 'test_timestamp', body: 'text_body'}]
    });
  } catch (error) {
    return next(error);
  }
};

var login = (error, response, body) => {
  var $ = cheerio.load(body)
  var formDefaults = {}
  var loginInputs = $("input")

  loginInputs.each( (i, input) => {
    var inputName = $(input).attr("name")
    var inputValue = $(input).val()
    formDefaults[inputName] = inputValue;
  });

  request.post(url.resolve('https://mbasic.facebook.com/', 'https://mbasic.facebook.com/login.php'), {
    form: Object.assign(formDefaults, {
      email:  process.env.EMAIL,
      pass: process.env.PASS
    }),
    headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'},
    jar: true
  }, (error, response, body) => {
    // change the domain the cookies apply to to mbasic.facebook.com rather than .facebook.com
    // otherwise simplecrawler does not add the cookies to the requests sent to mbasic.facebook.com
    parsedCookieHeaders = response.headers["set-cookie"].map( i => {
      return i.replace('.facebook.com', 'mbasic.facebook.com')
    })
    crawler.cookies.addFromHeaders(parsedCookieHeaders);

    crawler.start();
  });
};
