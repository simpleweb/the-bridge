const Crawler = require("simplecrawler")
const CrawlTracker = require("./crawlTracker")

const request = require("request")
const url = require("url")
const cheerio = require("cheerio")

const crawlHelper= class CrawlHelper {
  constructor() {
    this._crawler = new Crawler('https://mbasic.facebook.com/friends/center/friends/')
    this._crawlTracker = new CrawlTracker

    this.setupCrawler()
  }

  setupCrawler() {
    this._crawler.respectRobotsTxt = false

    this._crawler.discoverResources = (buffer, queueItem) => {
      var $ = cheerio.load(buffer.toString("utf8"));

      var timestamps = $('span').filter(function()  {
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

    // only queue friend hovercards, profiles, friend lists
    this._crawler.addFetchCondition( (queueItem, referrerQueueItem, callback) => {
      var hovercard = queueItem.uriPath === '/friends/hovercard/mbasic/'
      var profile = queueItem.path.match(/[a-zA-Z.0-9?=&]+fref=hovercard/) !== null
      var loadMoreFriends = (queueItem.uriPath === '/friends/center/friends/') && (!(this._crawlTracker.atFriendsLoadedLimit()))
      // we also want to go to 'Show More' posts pages - if the crawler identifies such a link, which will only be if we need to go further back in time

      callback(null, hovercard || profile || loadMoreFriends);
    });

    // record a new page of friends has been loaded
    this._crawler.on("queueadd", (queueItem, referrerQueueItem) => {
      if (queueItem.uriPath === '/friends/center/friends/') {
        this._crawlTracker.loadedMoreFriends()
      }
    })
  }

  get crawler() {
    return this._crawler;
  }

  login() {

  }
};

module.exports = crawlHelper;
