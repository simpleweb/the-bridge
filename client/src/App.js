import React, { Component } from "react"
import Posts from "./components/Posts"
import "./App.css"

import Sockette from "sockette"

class App extends Component{
  constructor(props) {
    super(props)
    this.state = {posts: [], websocket_state: 'closed'}

    this.socketteOptions = {
      timeout: 5e3,
      maxAttempts: 1,
      onopen: this.handleOpen.bind(this),
      onmessage: this.handleData.bind(this),
      onreconnect: e => console.log('Reconnecting...', e),
      onmaximum: e => console.log('Stop Attempting!', e),
      onclose: this.handleClose.bind(this),
      onerror: e => console.log('Error:', e)
    }
  }

  socketteUrl(){
    if (this.state.got_posts_before) {
      return `ws://localhost:8080/postsstream?get_posts_since=${encodeURIComponent(this.state.got_posts_before)}`
    } else {
      return 'ws://localhost:8080/postsstream'
    }
  }

  handleData(data) {
    let result = JSON.parse(data.data);
    console.log(result)

    this.setState(state => {
      // filter to include only posts that don't already have a match in the existing posts
      // this removes repeat messages which may be legitimate
      const newPosts = result.posts.filter(newPost => {
        return !state.posts.some(existingPost => {
          return (newPost.content === existingPost.content && newPost.user === existingPost.user)
        })
      })
      return {
        posts: [...newPosts, ...state.posts],
        got_posts_since: result.got_posts_since,
        got_posts_before: result.got_posts_before,
        websocket_state: state.websocket_state
      }
    })
  }

  handleOpen(e) {
    this.setState(state => {
      return {
        got_posts_since: state.got_posts_since,
        got_posts_before: state.got_posts_before,
        posts: state.posts,
        websocket_state: 'open'
      }
    })
  }

  handleClose(e) {
    this.setState(state => {
      return {
        got_posts_since: state.got_posts_since,
        got_posts_before: state.got_posts_before,
        posts: state.posts,
        websocket_state: 'closed'
      }
    })
  }

  openConnection(event){
    this.ws = new Sockette(this.socketteUrl(), this.socketteOptions)
  }

  stopConnection(event){
    this.ws.close()
  }

  openOrClose(){
    if (this.state.websocket_state === 'closed') {
      return (
        <input type='button' onClick={this.openConnection.bind(this)} value='start'/>
      )
    }

    if (this.state.websocket_state === 'open') {
      return (
        <input type='button' onClick={this.stopConnection.bind(this)} value='pause'/>
      )
    }
  }

  render(){
    return(
      <div className="App">
        { this.state.websocket_state }

        <Posts posts={this.state.posts}/>

        { this.openOrClose() }
      </div>
    );
  }

}

export default App;
