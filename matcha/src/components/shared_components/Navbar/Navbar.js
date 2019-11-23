import React, { Component } from 'react'
import { NavLink, Redirect } from "react-router-dom";
import PromiseCancel from '../../../helpers/PromiseCancel'
import SessionProvider from '../../../providers/SessionProvider'

import './Navbar.css'

export class Navbar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      mobileMenuOpen: false,
      redirectTo: ''
    }

    this.pendingPromises = []

    this.toggleMobileMenu = this.toggleMobileMenu.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  toggleMobileMenu() {

    this.setState({
      mobileMenuOpen: !this.state.mobileMenuOpen
    })
  }

  logOut(e) {
    e.preventDefault()

    const cancelableLogOutPromise = PromiseCancel.makeCancelable(
      SessionProvider.logout({})
    )

    this.pendingPromises.push(cancelableLogOutPromise)

    cancelableLogOutPromise.promise
    .then((json) => {

      if (json.status) {

        this.setState({
          redirectTo: '/'
        })
      }
    })
    .catch((json) => {

      sessionStorage.setItem('viewError', '1')

      this.setState({
        redirectTo: '/oops'
      })
    })
  }

  componentDidMount() {

  }

  render() {
    return (
      <nav>
        {
          this.state.redirectTo
            ? <Redirect to='/' />
            : null
        }
        <div className="nav-burger-container">
          <div className="nav-app-name">
            <h2>Matcha</h2>
          </div>
          <div className="nav-spacer"></div>
          <div className="nav-burger" onClick={this.toggleMobileMenu}>
            <div className="nav-burger-bar"></div>
            <div className="nav-burger-bar"></div>
            <div className="nav-burger-bar"></div>
          </div>
        </div>
        <div
          className={
            `nav-items-wrapper ${
              this.state.mobileMenuOpen
                ? 'nav-items-wrapper-open'
                : ''
            }`
          }
        >
          <ul className="nav-items">
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="/profile">Profile</NavLink></li>
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="/lol">Chat</NavLink></li>
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="">Browse</NavLink></li>
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="">Notifications</NavLink></li>
          </ul>
          <ul className="nav-items">
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="">Search</NavLink></li>
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="">Settings</NavLink></li>
            <li><a className="nav-link" onClick={this.logOut} href="/#">Logout</a></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Navbar
