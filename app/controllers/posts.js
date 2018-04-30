var Crawler = require("simplecrawler"),
    url = require("url"),
    cheerio = require("cheerio"),
    request = require("request");

var crawler = new Crawler('https://mbasic.facebook.com/friends/center/friends/')

crawler.maxDepth = 1
crawler.respectRobotsTxt = false

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

var login = function(error, response, body) {
  var $ = cheerio.load(body)
  var formDefaults = {}
  var loginInputs = $("input")

  loginInputs.each(function(i, input) {
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
  }, function(error, response, body) {
    // change the domain the cookies apply to to mbasic.facebook.com rather than .facebook.com
    // otherwise simplecrawler does not add the cookies to the requests sent to mbasic.facebook.com
    parsedCookieHeaders = response.headers["set-cookie"].map( i=> {
      return i.replace('.facebook.com', 'mbasic.facebook.com')
    })
    crawler.cookies.addFromHeaders(parsedCookieHeaders);

    crawler.start();
  });

  crawler.on('crawlstart', function () {
    console.log("START CRAWL")
  });

  crawler.on('complete', function() {
    console.log('FINISHED CRAWL')
  });
};
