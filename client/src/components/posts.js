import React, { Component } from "react"
import Post from "./Post"

class Posts extends Component{
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <div className="Posts">
        { this.props.posts.map((post) => {
            return <Post post={post} key={`${post.timestamp}-${post.user}`}/>
          })
        }
      </div>
    );
  }
}

export default Posts;
