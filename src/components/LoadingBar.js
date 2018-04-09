import React, { Component } from 'react';

class LoadingBar extends Component {

  render() {
    return(
      <div className="progress">
        <div className="progress-bar progress-bar-striped active" role="progressbar"
             aria-valuenow={this.props.current} aria-valuemin="0" aria-valuemax={this.props.max} style={{width: this.props.current/this.props.max*100 + "%"}}>
          {this.props.current/this.props.max*100 + "%"}
        </div>
      </div>
    )
  }
}

export default LoadingBar;