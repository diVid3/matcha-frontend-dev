import React, { Component } from 'react'

import './NotificationBubble.css'

export class NotificationBubble extends Component {
  render() {
    return (
      <div
        className={
          this.props.desktop
            ? 'notification-bubble'
            : 'notification-bubble-mobile'
        }
      >
        {
          this.props.notifications.filter((n) => n.read === '0' || n.read === 0).length
        }
      </div>
    )
  }
}

export default NotificationBubble
