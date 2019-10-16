import React, { Component } from 'react'

import './Oops.css'

export class Oops extends Component {
  render() {
    return (
      <div className="oops-body">
        <div className="oops-container">
          <h2 className="oops-body-header">Oops!</h2>
          <p className="oops-body-message">Something went wrong, try loading the app again</p>
        </div>
      </div>
    )
  }
}

export default Oops
