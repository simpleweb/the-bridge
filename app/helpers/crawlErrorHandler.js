const crawlErrorHandler = class CrawlErrorHandler {
  constructor(crawler) {
    this._crawler = crawler;
    this.listenForErrors()
  }

  listenForErrors() {
    this._crawler.on("queueerror", (error, URLData) => {
      console.log("queue error", error)
      throw error
    })
    this._crawler.on("queueduplicate", (URLData) => {
      console.log("queue duplicate error", URLData)
    })
    this._crawler.on("robotstxterror", (error) => {
      console.log("robots txt error", error)
      throw error
    })
    this._crawler.on("fetchconditionerror", (queueItem, error) => {
      console.log("fetch condition error", queueItem, error)
      throw error
    })
    this._crawler.on("cookieerror", (queueItem, error, setCookieHeader) => {
      console.log("cookie error", queueItem, error)
      throw error
    })
    this._crawler.on("fetchtimeout", (queueItem, crawlerTimeoutValue) => {
      console.log("fetch timeout", queueItem)
      throw `fetch timeout on ${queueItem}`
    })
    this._crawler.on("fetcherror", (queueItem, responseObject) => {
      console.log("fetch error", queueItem)
      throw `fetch error on ${queueItem}`
    })
    this._crawler.on("fetchclienterror", (queueItem, error) => {
      console.log("fetch client error", queueItem, error)
      throw error
    })
    this._crawler.on("fetch404", (queueItem, responseObject) => {
      console.log("fetch404", queueItem)
      throw `fetch 404 on ${queueItem}`
    })
    this._crawler.on("fetch410", (queueItem, responseObject) => {
      console.log("fetch410", queueItem)
      throw `fetch 410 on ${queueItem}`
    })
    this._crawler.on("fetchdataerror", (queueItem, responseObject) => {
      console.log("fetchdataerror", queueItem)
      throw `fetch data error on ${queueItem}`
    })
  }

};

module.exports = crawlErrorHandler;
