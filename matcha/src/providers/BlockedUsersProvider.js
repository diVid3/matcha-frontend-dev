import Config from '../config/Config'

export class BlockedUsersProvider {

  static getBlockedUsersBySession() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/blocked-users/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting blocked users by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting blocked users by session.' }]
        })
      })
    })
  }

  static createBlockedUserBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/blocked-users/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, creating blocked user by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, creating blocked user by session.' }]
        })
      })
    })
  }

  static deleteBlockedUserBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/blocked-users/session`, {
        method: 'DELETE',
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, deleting blocked user by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, deleting blocked user by session.' }]
        })
      })
    })
  }
}

export default BlockedUsersProvider
