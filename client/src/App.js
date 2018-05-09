import React, { Component } from "react"
import Websocket from 'react-websocket'
import Posts from "./components/Posts"

import "./App.css"

class App extends Component{
  constructor(props) {
    super(props)
    this.state = {posts: []}
  }

  handleData(data) {
    let result = JSON.parse(data);

    this.setState({
      posts: [...result.posts, ...this.state.posts],
      got_posts_since: result.got_posts_since,
      got_posts_before: result.got_posts_before
    })
  }

  render(){
    return(
      <div className="App">
        <Posts posts={this.state.posts}/>
        <Websocket url='ws://localhost:8080/postsstream' onMessage={this.handleData.bind(this)} reconnect={false}/>
      </div>
    );
  }

}

export default App;
