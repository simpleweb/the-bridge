const friendsPerPage = 10;
const numberOfFriendsToScrape = 100;

const crawlTracker = class CrawlTracker {
  constructor() {
    this._friendsLoaded = 0;
  }

  loadedMoreFriends() {
    this._friendsLoaded += friendsPerPage;
  }

  reset() {
    this._friendsLoaded = 0;
  }

  get friendsLoaded() {
    return this._friendsLoaded;
  }

  get numberOfFriendsToScrape() {
    return numberOfFriendsToScrape;
  }

  atFriendsLoadedLimit(){
    return this._friendsLoaded >= numberOfFriendsToScrape
  }
};

module.exports = crawlTracker;
