import React, { Component } from 'react'

import './NotificationsContainer.css'

export class NotificationsContainer extends Component {

  componentWillUnmount() {

    this.props.readAllNotifications()
  }

  render() {
    return (
      <div className="notifications-container">
        {
          !this.props.notifications.length
            ? <p className="notifications-container-empty-text">No notifications</p>
            : [
                ...this.props.notifications.filter((n) => n.read - 0 === 0),
                ...this.props.notifications.filter((n) => n.read - 0 === 1)
              ].map((n, i) =>
                <div 
                  className="notifications-container-notification"
                  key={i}
                >
                  <p
                    className={`notifications-container-notification-text ${
                      !(n.read - 0)
                        ? 'notifications-container-notification-text-unread'
                        : ''
                    }`}
                  >
                    {n.notification}
                  </p>
                </div>
              )
        }
      </div>
    )
  }
}

export default NotificationsContainer
