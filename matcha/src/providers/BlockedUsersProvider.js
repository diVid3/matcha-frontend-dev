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
}

export default BlockedUsersProvider
