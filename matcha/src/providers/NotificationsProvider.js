import Config from '../config/Config'

export class MessagesProvider {

  static getNotificationsBySession() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/notifications/session`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      })
      .then((response) => {

        response.json()
        .then((data) => {

          if (!response.ok) {
            return rej(data)
          }

          res(data)
        })
        .catch((err) => {
  
          rej({
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting notifications by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting notifications by session.' }]
        })
      })
    })
  }

  // Requires { notification, read }
  static createNotificationBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/notifications/session`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      })
      .then((response) => {

        response.json()
        .then((data) => {

          if (!response.ok) {
            return rej(data)
          }

          res(data)
        })
        .catch((err) => {
  
          rej({
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, creating notification by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, creating notification by session.' }]
        })
      })
    })
  }
}

export default MessagesProvider
