import React, { Component } from 'react'

import './LoadingSpinner.css'

export class LoadingSpinner extends Component {
  render() {
    return (
      <div className="loading-spinner-body">
        <div className="loading-spinner-outer">
          <div className="loading-spinner-inner">
            <div className="loading-spinner-inner-inner">
              <div className="loading-spinner-bar1"></div>
              <div className="loading-spinner-bar2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoadingSpinner
