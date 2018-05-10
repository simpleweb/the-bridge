import React, { Component } from "react"

class Post extends Component{
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <div className="Post">
        { this.props.post.user }
        { this.props.post.content }
        { this.props.post.prettyTimestamp }
      </div>
    );
  }
}

export default Post;
