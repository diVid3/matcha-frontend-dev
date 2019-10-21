import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import './Oops.css'
import oops from '../../assets/error2.png'

export class Oops extends Component {
  constructor(props) {
    super(props)

    this.state = {
      redirectTo: ''
    }
  }

  componentDidMount() {

    if (!sessionStorage.getItem('viewError')) {

      this.setState({
        redirectTo: '/'
      })
    }
    else {
      sessionStorage.removeItem('viewError')
    }
  }

  render() {
    return (
      <div className="oops-body">
        {
          this.state.redirectTo
            ? <Redirect to={`${this.state.redirectTo}`}/>
            : null
        }
        <div className="oops-container">
          <h2 className="oops-body-header">Oops!</h2>
          <p className="oops-body-message">Something went wrong, try loading the app again</p>
          <img src={oops} alt="oops"/>
        </div>
      </div>
    )
  }
}

export default Oops
