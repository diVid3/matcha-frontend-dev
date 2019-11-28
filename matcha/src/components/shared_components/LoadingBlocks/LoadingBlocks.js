import React, { Component } from 'react'

import './LoadingBlocks.css'

export class LoadingBlocks extends Component {
  render() {
    return (
      <div className="loading-blocks-container">
        <div className="loading-block loading-block-1"></div>
        <div className="loading-block loading-block-2"></div>
        <div className="loading-block loading-block-3"></div>
        <div className="loading-block loading-block-4"></div>
      </div>
    )
  }
}

export default LoadingBlocks
