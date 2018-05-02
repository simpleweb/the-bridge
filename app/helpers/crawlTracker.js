const friendsPerPage = 10;
const numberOfFriendsToScrape = 30;

const crawlTracker = class CrawlTracker {
  constructor() {
    this._friendsLoaded = 0;
  }

  loadedMoreFriends() {
    this._friendsLoaded += friendsPerPage;
  }

  get friendsLoaded() {
    return this._friendsLoaded;
  }

  get numberOfFriendsToScrape() {
    return  numberOfFriendsToScrape;
  }

  atFriendsLoadedLimit(){
    return this._friendsLoaded >= numberOfFriendsToScrape
  }
};

module.exports = crawlTracker;
