import Config from '../config/Config'

export class UsersProvider {

  static getUserByUsername(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/username/${body.username}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then((response) => {

        response.json()
        .then((data) => {

          if (!response.ok) {
            return rej(data)
          }

          res(data)
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting user by username.' }]
        })
      })
    })
  }

  static getUserByEmail(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/email/${body.email}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then((response) => {

        response.json()
        .then((data) => {

          if (!response.ok) {
            return rej(data)
          }

          res(data)
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting user by email.' }]
        })
      })
    })
  }

  static patchUserByEmail(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/email`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
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
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, patching user by email.' }]
        })
      })
    })
  }
}

export default UsersProvider
