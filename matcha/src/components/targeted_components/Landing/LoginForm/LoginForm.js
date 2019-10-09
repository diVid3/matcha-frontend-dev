import React, { Component } from 'react'

import './LoginForm.css'

export class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }

    this.onChange = this.onChange.bind(this)
    this.switchFormWrapper = this.switchFormWrapper.bind(this)
    this.showResetFormWrapper = this.showResetFormWrapper.bind(this)
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  switchFormWrapper(e) {
    e.preventDefault()
    this.props.switchForm();
  }

  showResetFormWrapper(e) {
    e.preventDefault()
    this.props.showResetForm();
  }

  render() {
    return (
      <div className="landing-form-login-body">
        <form className="login-form">
          <h2>Login</h2>
          <p className="switch-text">
            Not a member? <a
              className="switch-form"
              href="/#"
              onClick={this.switchFormWrapper}
            >
              Register here
            </a>
          </p>
          <input
            className="login-form-input"
            type="email"
            name="email"
            value={this.state.email}
            placeholder="Email"
            onChange={this.onChange}
          />
          <input
            className="login-form-input"
            type="password"
            name="password"
            value={this.state.password}
            placeholder="Password"
            onChange={this.onChange}
          />
          <button
            className="login-form-button"
            type="submit"
            value="Submit"
          >
            Login
          </button>
          <p className="reset-text">
            Forgot password? <a
              className="reset-form"
              href="/#"
              onClick={this.showResetFormWrapper}
              >
                Reset it
              </a>
          </p>
        </form>
      </div>
    )
  }
}

export default LoginForm
