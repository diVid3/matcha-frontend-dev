import Config from '../config/Config'

export class FriendsProvider {

  static getFriendsByUsername(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/friends/username/${body.username}`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting friends by username.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting friends by username.' }]
        })
      })
    })
  }
}

export default FriendsProvider
