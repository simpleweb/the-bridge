# the-bridge

This includes a completely self-contained API for pulling in your Facebook friends' posts, and a client you can use to consume it.  

To get started quickest:  
1. clone the repo
2. cd into the repo, then cd into the bin directory
3. run `npm install`
4. run `node the-bridge install` and follow the prompts
5. run `node the-bridge start`
6. open a browser and visit `localhost:1234`
7. click 'Open' to start up a feed of posts sent by your top 30 friends
8. pause the lookup at any point by clicking 'Pause'
9. kill the client and API in the terminal with `ctrl c`

You can increase the number of friends it will search by editing the `crawlTracker` file.

To use the API separately (without the ready-made client), cd into API, run `npm install` and `npm start`. You can then send regular http get requests to the `/posts` endpoint (this performs a single crawl through your top 30 friends), or open a websocket connection by sending a websocket request to `/postsstream` (this does repeated crawls, sending posts back to the client when they are found).
