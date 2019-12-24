import Config from '../config/Config'

export class FakeUsersProvider {

  static createFakeUserBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/fake-users/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, creating fake user by user_id.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, creating fake user by user_id.' }]
        })
      })
    })
  }
}

export default FakeUsersProvider
