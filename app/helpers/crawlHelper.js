const Crawler = require("simplecrawler")
const CrawlTracker = require("./crawlTracker")
const PostCollection = require('../models/post_collection')
const CrawlErrorHandler = require('./crawlErrorHandler')
const dateHelper = require('./date')

const request = require("request-promise-native")
const url = require("url")
const cheerio = require("cheerio")

const crawlHelper= class CrawlHelper {
  constructor(options) {
    this._get_posts_since = dateHelper.convertStandardDate(options.get_posts_since)
    this._get_posts_before = dateHelper.convertStandardDate(options.get_posts_before)

    this._crawler = new Crawler('https://mbasic.facebook.com/friends/center/friends/')
    this._crawlTracker = new CrawlTracker
    this._posts = new PostCollection(this._get_posts_before, this._get_posts_since)
    this._crawlErrorHandler = new CrawlErrorHandler(this._crawler)
    this._jar = request.jar()

    this.setupCrawler()
  }

  get crawler() {
    return this._crawler;
  }

  get posts() {
    return this._posts;
  }

  setPostsBefore(dateVal) {
    this._get_posts_before = new Date(dateVal);
  }

  setupCrawler() {
    this._crawler.respectRobotsTxt = false
    this._crawler.maxConcurrency = 5;

    this._crawler.on("crawlstart", () => {
      console.log("start")
    })

    this._crawler.discoverResources = (buffer, queueItem) => {
      var $ = cheerio.load(buffer.toString("utf8"));

      var likeAndReactSpans = this.likeAndReactSpans($)

      if (likeAndReactSpans.length > 0) {
        var lastPostTimestamp = dateHelper.convertFacebookDate(
          likeAndReactSpans.last().parent().prev().find('abbr').text()
        )
        var firstPostTimestamp = dateHelper.convertFacebookDate(
          likeAndReactSpans.first().parent().prev().find('abbr').text()
        )
      }

      // ignore links on the page if the final post was sent earlier than the time from which we want to check more recent posts
      let isTimeCorrect = dateHelper.isBefore(lastPostTimestamp, this._get_posts_since) 
        && dateHelper.isAfter(firstPostTimestamp, this._get_posts_before);

      if (likeAndReactSpans.length === 0 || !isTimeCorrect) {
        return $("a[href]").map(function () {
          return $(this).attr("href");
        }).get();
      }
    };

    // only queue friend hovercards, profiles, friend lists
    this._crawler.addFetchCondition( (queueItem, referrerQueueItem, callback) => {
      var hovercard = queueItem.uriPath === '/friends/hovercard/mbasic/'
      var profile = this.isProfileLink(queueItem)
      var loadMoreFriends = (queueItem.uriPath === '/friends/center/friends/') && (!(this._crawlTracker.atFriendsLoadedLimit()))
      var loadMorePosts = this.isMorePostsLoadedLink(queueItem)

      callback(null, hovercard || profile || loadMoreFriends || loadMorePosts);
    });

    // record that a new page of friends has been loaded
    this._crawler.on("queueadd", (queueItem, referrerQueueItem) => {
      if (queueItem.uriPath === '/friends/center/friends/') {
        this._crawlTracker.loadedMoreFriends()
      }
    })

    // parse posts from a profile and add to posts store
    this._crawler.on("fetchcomplete", (queueItem, responseBuffer, response) => {
      if (this.isProfileLink(queueItem) || this.isMorePostsLoadedLink(queueItem)) {
        const $ = cheerio.load(responseBuffer.toString());

        var articles = this.likeAndReactSpans($).map(function() {
          return $(this).parent().parent().parent();
        });

        var name = $('.bm')
          .find('strong')
          .text();

        this._posts.addPosts(name, articles);

        console.log("Fetched a profile", queueItem.uriPath);
      }
    });
  }

  async login() {
    var loginScreen = await this.goToLoginScreen()

    var formDefaults = {}
    var loginInputs = loginScreen("input")

    loginInputs.each( (i, input) => {
      var inputName = loginScreen(input).attr("name")
      var inputValue = loginScreen(input).val()
      formDefaults[inputName] = inputValue;
    });

    var loggedInResponse = await this.submitLoginRequest(formDefaults)

    this.setCookiesOnCrawler(loggedInResponse.headers["set-cookie"])
  }

  async goToLoginScreen() {
    var navigateToLoginScreenOptions = {
      method: "GET",
      uri: 'https://mbasic.facebook.com/login.php',
      headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'},
      jar: this._jar,
      transform: (body) => {
        return cheerio.load(body);
      }
    }
    return await request(navigateToLoginScreenOptions)
  }

  async submitLoginRequest(formDefaults) {
    var logInOptions = {
      method: "POST",
      uri: 'https://mbasic.facebook.com/login.php',
      formData: Object.assign(formDefaults, {
        email: process.env.EMAIL,
        pass: process.env.PASS
      }),
      headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'},
      jar: this._jar
    }
    try {
      var loggedInResponse = await request(logInOptions);
      return loggedInResponse.response
    } catch(error) {
      if (error.response && error.response.statusCode === 302) {
        return error.response
      } else {
        throw error
      }
    }
  }

  setCookiesOnCrawler(cookiesHeader) {
    var parsedCookieHeaders = cookiesHeader.map( i => {
      return i.replace('.facebook.com', 'mbasic.facebook.com')
    })
    this._crawler.cookies.addFromHeaders(parsedCookieHeaders);
  }

  likeAndReactSpans($){
    return $('span').filter(function()  {
      return $(this).text().trim().match(/Like.+React/) !== null;
    })
  }

  isProfileLink(queueItem){
    return queueItem.path.match(/[a-zA-Z.0-9?=&]+fref=hovercard/) !== null
  }

  isMorePostsLoadedLink(queueItem){
    return queueItem.path.match(/[a-zA-Z.0-9]+\?sectionLoadingID=m_timeline_loading_div_/) !== null
  }
};

module.exports = crawlHelper;
