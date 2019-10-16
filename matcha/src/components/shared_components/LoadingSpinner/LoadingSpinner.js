import React, { Component } from 'react'

import './LoadingSpinner.css'

export class LoadingSpinner extends Component {
  render() {
    return (
      <div className="spinner-outer-circle">
        <div className="spinner-inner-circle">
          <div className="spinner-inner-bar spinner-inner-bar-1"></div>
          <div className="spinner-inner-bar spinner-inner-bar-2"></div>
          <div className="spinner-inner-bar spinner-inner-bar-3"></div>
        </div>
      </div>
    )
  }
}

export default LoadingSpinner
