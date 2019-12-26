import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './ChatBubble.css'

export class ChatBubble extends Component {
  render() {
    return (
      <div
        className={`chat-bubble ${
          this.props.left
            ? 'chat-bubble-left'
            : 'chat-bubble-right'
        }`}
      >
        <div
          className={`chat-bubble-inner ${
            this.props.left
              ? 'chat-bubble-inner-left'
              : 'chat-bubble-inner-right'
          }`}
        >
          <div
            className={
              this.props.left
                ? 'chat-bubble-triangle-left'
                : 'chat-bubble-triangle-right'
            }
          />
          <p
            className={`chat-bubble-text ${
              this.props.left
                ? 'chat-bubble-text-left'
                : 'chat-bubble-text-right'
            }`}
          >
            {
              this.props.text
            }
          </p>
          <p
            className={`chat-bubble-date-time ${
              this.props.left
                ? 'chat-bubble-date-time-left'
                : 'chat-bubble-date-time-right'
            }`}
          >
            {
              this.props.messageDateTime
                ? new Date(this.props.messageDateTime).toLocaleString().replace(/\//g, '.')
                : new Date().toLocaleString().replace(/\//g, '.')
            }
          </p>
        </div>
      </div>
    )
  }
}

ChatBubble.propTypes = {
  left: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  messageDateTime: PropTypes.number.isRequired
}

export default ChatBubble
