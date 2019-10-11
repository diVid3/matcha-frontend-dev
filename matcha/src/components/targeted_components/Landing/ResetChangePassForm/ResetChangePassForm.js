import React, { Component } from 'react'
import InputValidation from '../../../../helpers/InputValidation'
import PromiseCancel from '../../../../helpers/PromiseCancel'

import './ResetChangePassForm.css'

export class ResetChangePassForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      
    }

    this.pendingPromises = []

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillUnmount() {

    // TODO: Cancel any pending promises here.
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  render() {
    return (
      <div className="reset-change-pass-body">
        
      </div>
    )
  }
}

export default ResetChangePassForm
