import React, { Component } from 'react'

import './ResetChangePassForm.css'

export class ResetChangePassForm extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }

    this.pendingPromises = []
  }

  componentWillUnmount() {

    // TODO: Cancel any pending promises here.
  }

  render() {
    return (
      <div className="reset-change-pass-body">
        
      </div>
    )
  }
}

export default ResetChangePassForm
