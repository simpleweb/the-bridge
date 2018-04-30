var Crawler = require("simplecrawler"),
    url = require("url"),
    cheerio = require("cheerio"),
    request = require("request");

var crawler = new Crawler('https://mbasic.facebook.com/friends/center/friends/');

crawler.maxDepth = 3;
crawler.respectRobotsTxt = false;
crawler.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36';

exports.index = async (req, res, next) => {
  request('https://mbasic.facebook.com/login.php', { 
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'Referer': 'https://mbasic.facebook.com/'
    },
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
  //var cookie = response.headers["set-cookie"];
  //console.log('COOKIE: ' + cookie);
  //crawler.cookies.addFromHeaders(cookie);

  var $ = cheerio.load(body),
        formDefaults = {},
        loginInputs = $("input");

    // We loop over the input elements and extract their names and values so
    // that we can include them in the login POST request
    loginInputs.each(function(i, input) {
        var inputName = $(input).attr("name"),
            inputValue = $(input).val();

        formDefaults[inputName] = inputValue;
    });

  request.post(url.resolve('https://mbasic.facebook.com/', 'https://mbasic.facebook.com/login.php'), {
    form: Object.assign(formDefaults, {
      email:  process.env.EMAIL,
      pass: process.env.PASS
    }),
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    },
    jar: true
  }, function(error, response, body) {    
      crawler.cookies.addFromHeaders(response.headers["set-cookie"], function() {
      crawler.start();
      console.log('COOKIES: ' + crawler.cookies);
    });

    request('https://mbasic.facebook.com/friends/center/friends/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
      },
      jar: true
      }, function(error, response, body) {
        //console.log(response);
      });
  });

  crawler.on('crawlstart', function () {
    console.log('Start');
  });

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
    //console.log('The content of the page: ' + responseBuffer.toString());
  });

  crawler.on('complete', function() {
    console.log('Finished');
  });

  crawler.cookies.on('addcookie', function(cookie) {
    //console.log('Cookie added: ' + cookie);
  });
  
  crawler.on('fetchstart', function(queueItem, requestOptions) {
    console.log('Queue Item: ' + queueItem.url);
    //console.log('Request Options: ' + requestOptions);
  });
};