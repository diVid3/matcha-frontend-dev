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

          throw new Error('Response from the backend wasn\'t ok!')
        }

        response.json()
      })
      .then((data) => res(data))
      .catch((err) => rej({ success: false }))
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

          throw new Error('Response from the backend wasn\'t ok!')
        }

        response.json()
      })
      .then((data) => res(data))
      .catch((err) => rej({ success: false }))
    })
  }
}

export default RegistrationProvider
