import React, { Component } from 'react'
import { NavLink, Redirect } from "react-router-dom";
import PromiseCancel from '../../../helpers/PromiseCancel'
import SessionProvider from '../../../providers/SessionProvider'
import NotificationBubble from '../NotificationBubble/NotificationBubble'

import './Navbar.css'

export class Navbar extends Component {

  constructor(props) {
    super()

    this.state = {
      mobileMenuOpen: false,
      redirectTo: ''
    }

    this.pendingPromises = []

    this.toggleMobileMenu = this.toggleMobileMenu.bind(this)
    this.logOut = this.logOut.bind(this)
    this.handleMobileNotificationClick = this.handleMobileNotificationClick.bind(this)
  }

  handleMobileNotificationClick(e) {
    e.preventDefault()
    this.props.openModal()
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
            <div><NavLink className="nav-logo" to="/profile"></NavLink></div>
            <div><NavLink className="nav-logo-h2" to="/profile">atcha</NavLink></div>
          </div>
          <ul className="nav-desk-items nav-desk-items-left">
            <li className="nav-desk-item nav-desk-item-left"><NavLink className="nav-desk-item-link" to="/profile">Profile</NavLink></li>
            <li className="nav-desk-item nav-desk-item-left"><NavLink className="nav-desk-item-link" to="/browse">Browse</NavLink></li>
            <li className="nav-desk-item nav-desk-item-left"><NavLink className="nav-desk-item-link" to="/search">Search</NavLink></li>
            <li className="nav-desk-item nav-desk-item-left"><NavLink className="nav-desk-item-icon-chat" to="/chat"></NavLink></li>
            <li
              className="nav-desk-item nav-desk-item-left nav-desk-item-icon-container"
            >
              {
                this.props.notifications.filter((n) => n.read - 0 === 0).length
                  ? <NotificationBubble
                      notifications={this.props.notifications}
                      desktop={true}
                    />
                  : null
              }
              <span className="nav-desk-item-icon-notification" onClick={this.props.openModal}/>
            </li>
          </ul>
          <div className="nav-spacer"></div>
          <ul className="nav-desk-items nav-desk-items-right">
            <li className="nav-desk-item nav-desk-item-right"><NavLink className="nav-desk-item-icon-setting" to="/settings"></NavLink></li>
            <li className="nav-desk-item nav-desk-item-right"><a className="nav-desk-item-link" onClick={this.logOut} href="/#">Logout</a></li>
          </ul>
          <div className="nav-burger-wrapper">
            <div
              className={
                `nav-burger ${
                  this.state.mobileMenuOpen
                    ? 'nav-burger-open'
                    : ''
                }
              `} onClick={this.toggleMobileMenu}>
              <div className="nav-burger-bar"></div>
              <div className="nav-burger-bar"></div>
              <div className="nav-burger-bar"></div>
            </div>
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
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="/browse">Browse</NavLink></li>
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="/chat">Chat</NavLink></li>
            <li
              className="nav-link-notifications-fill"
              onClick={this.handleMobileNotificationClick}
            >
              <a
                className="nav-link nav-link-notifications"
                href="/#"
              >
                Notifications
              </a>
              {
                this.props.notifications.filter((n) => n.read - 0 === 0).length
                  ? <NotificationBubble
                      notifications={this.props.notifications}
                      desktop={false}
                    />
                  : null
              }
            </li>
          </ul>
          <ul className="nav-items">
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="/search">Search</NavLink></li>
            <li><NavLink className="nav-link" onClick={this.toggleMobileMenu} to="/settings">Settings</NavLink></li>
            <li><a className="nav-link" onClick={this.logOut} href="/#">Logout</a></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Navbar
