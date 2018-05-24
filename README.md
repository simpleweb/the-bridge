# The Bridge

If you'd like a completely unbiased feed of your Facebook friends' posts, this tool is for you.  

## The background

This project was broadly prompted by thinking about how to empower social network users. One current limitation is how separate social networks are - it's hard to feel ownership of our online activity when we are locked into so many separate networks that don't connect with each other. We thought it would cool to build a bridge between networks that let us each manage all our communications in one place. Another limitation are the unknown algorithms that curate the content we see. We thought it would be cool if the bridge we built also gave control to the user over what appears in their news feed.  

These lofty ambitions were tamed into a manageable goal: build a tool that pulls in posts from one social network, bypassing that network's algorithms. It could be extended to bring in posts from other networks, and to let users devise their own rules about what posts to see.  

## So what is it?  

This project includes a completely self-contained (express.js) API for pulling in your Facebook friends' posts, and a (react.js) client you can use to consume it. Running both together on your machine, you can get a (not very pretty) live feed of what your friends are posting, without filtering your posts like the Facebook newsfeed does.  

## How do I use it?

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

You can increase the number of friends it will search by editing the `numberOfFriendsToScrape` variable in the `crawlTracker` file.

To use the API separately (without the ready-made client), cd into API, run `npm install` and `npm start`. You can then send regular http get requests to the `/posts` endpoint (this performs a single crawl through your friends), or open a websocket connection by sending a websocket request to `/postsstream` (this does repeated crawls, sending posts back to the client when they are found).  

## Contributing  

You're welcome to submit a pull request, or create an issue so we can discuss your suggestions.

## License  

The Bridge is provided under the MIT License

```
The MIT License (MIT)
Copyright (c) 2018 Simpleweb
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
