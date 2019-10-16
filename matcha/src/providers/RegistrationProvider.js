import Config from '../config/Config'

export class RegistrationProvider {

  static registerUser(data) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => {

        if (!response.ok) {

          rej(true)
        }

        res(true)
      })
      .catch((err) => rej(true))
    })
  }

  static sendEmail(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/send-registration-email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then((response) => {

        if (!response.ok) {

          rej(true)
        }

        res(true)
      })
      .catch((err) => rej(true))
    })
  }

  static verifyRegistration(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/verify-registration`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then((response) => {

        if (!response.ok) {

          rej(true)
        }

        res(true)
      })
      .catch((err) => rej(true))
    })
  }
}

export default RegistrationProvider
