import React, { Component } from 'react'
// import PromiseCancel from '../../../../helpers/PromiseCancel'

import './RegistrationSuccess.css'
import checkmark from '../../../../assets/sent2.png'

export class RegistrationSuccess extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }

    this.pendingPromises = []
  }

  componentDidMount() {

    // const cancelableSwitchToLoginPromise = PromiseCancel.makeCancelable(new Promise((res, rej) => {
    //   setTimeout(() => res(true), 10000)
    // }))

    // this.pendingPromises.push(cancelableSwitchToLoginPromise)

    // cancelableSwitchToLoginPromise.promise
    // .then(() => {
    //   this.props.switchForm('login')
    // })
    // .catch(() => {})
  }

  componentWillUnmount() {

    this.pendingPromises.map(p => p.cancel())
  }

  render() {
    return (
      <div className="registration-success-body">
        <div className="registration-success-container">
          <p className="registration-success-message">
            Please see the instructions in the email sent to you to verify your registration
          </p>
          <img src={checkmark} alt="registration-email-sent"/>
        </div>
      </div>
    )
  }
}

export default RegistrationSuccess
