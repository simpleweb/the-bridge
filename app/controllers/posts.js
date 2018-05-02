_crawlHelper = require('../helpers/crawlHelper')
crawlHelper = new _crawlHelper

const request = require("request")
const url = require("url")
const cheerio = require("cheerio")

// handle a profile fetched
crawlHelper.crawler.on("fetchcomplete", (queueItem, responseBuffer, response) => {
  if (queueItem.path.match(/[a-zA-Z.0-9?=&]+fref=hovercard/)) {
    console.log("Fetched", queueItem.url);
  }
});

crawlHelper.crawler.on("crawlstart", () => {
  console.log("Start");
});
crawlHelper.crawler.on("complete", () => {
  console.log("Complete");
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
    crawlHelper.crawler.cookies.addFromHeaders(parsedCookieHeaders);

    crawlHelper.crawler.start();
  });
};
