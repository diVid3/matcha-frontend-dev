import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Config from '../../../../config/Config'
import PromiseCancel from '../../../../helpers/PromiseCancel'
import UsersProvider from '../../../../providers/UsersProvider'
import SocketWrapper from '../../../../helpers/SocketWrapper'

import './ChatCard.css'
import defaultpp from '../../../../assets/placeholder.png'

export class ChatCard extends Component {
  constructor(props) {
    super()

    this.state = {
      isUserLoggedIn: false
    }

    this.pendingPromises = []
    this._isMounted = false

    this.getProfilePicPath = this.getProfilePicPath.bind(this)
  }

  getProfilePicPath(basePath) {

    return basePath ? (`${Config.backend}/` + basePath) : ''
  }

  componentDidMount() {

    this._isMounted = true

    const cancelableIsUserLoggedInPromise = PromiseCancel.makeCancelable(
      UsersProvider.isUserLoggedIn({
        username: this.props.username
      })
    )

    this.pendingPromises.push(cancelableIsUserLoggedInPromise)

    cancelableIsUserLoggedInPromise.promise
    .then((json) => {

      if (json.status) {

        this.setState({
          isUserLoggedIn: true
        })
      }
    })
    .catch((json) => {})

    const socket = SocketWrapper.getSocket()
  
    socket.on('fromServerUserLoggedIn', (data) => {
      if (this._isMounted && data.username === this.props.username) {
        this.setState({
          isUserLoggedIn: true
        })
      }
    })

    socket.on('fromServerUserLoggedOff', (data) => {
      if (this._isMounted && data.username === this.props.username) {
        this.setState({
          isUserLoggedIn: false
        })
      }
    })
  }

  componentWillUnmount() {

    this._isMounted = false

    this.pendingPromises.forEach(p => p.cancel())
  }

  render() {
    return (
      <div className="chat-card" onClick={this.props.selectHandler}>
        <div className="chat-card-pp-container">
          <img className="chat-card-pp"
            src={
              this.props.profilePicPath
                ? this.getProfilePicPath(this.props.profilePicPath)
                : defaultpp
            }
            alt="chat profile"
          />
          {
            this.state.isUserLoggedIn
              ? <div className="chat-card-pp-user-online" />
              : null
          }
        </div>
        <div className="chat-card-info-container">
          <div className="chat-card-info-names-container">
            <p className="chat-card-text chat-card-full-name">
              {
                this.props.firstName + ' ' + this.props.lastName
              }
            </p>
            <p className="chat-card-text chat-card-username">
              {
                this.props.username
              }
            </p>
          </div>
          <p className="chat-card-text chat-card-last-message-date">
            {
              this.props.lastMessageDate
                ? new Date(this.props.lastMessageDate).toLocaleString().split(', ')[0].split('/').join('.')
                : new Date().toLocaleString().split(', ')[0].split('/').join('.')
            }
          </p>
          <p className="chat-card-text chat-card-last-message">
            {
              this.props.lastMessage
                ? this.props.lastMessage
                : 'Select this chat to start messaging...'
            }
          </p>
        </div>
      </div>
    )
  }
}

ChatCard.propTypes = {
  selectHandler: PropTypes.func.isRequired,
  profilePicPath: PropTypes.string,
  username: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  lastMessageDate: PropTypes.number,
  lastMessage: PropTypes.string
}

export default ChatCard
