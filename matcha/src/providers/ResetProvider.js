import Config from '../config/Config'

export class ResetProvider {

  static sendResetEmail(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/send-reset-email`, {
        method: 'POST',
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
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, sending password reset email.' }]
        })
      })
    })
  }

  static verifyReset(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/reset-token/${body.resetToken}`, {
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
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, verifying user password reset.' }]
        })
      })
    })
  }
}

export default ResetProvider
