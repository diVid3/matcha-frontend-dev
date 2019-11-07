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

        response.json()
        .then((data) => {

          if (!response.ok) {
            return rej(data)
          }

          res(data)
        })
        .catch((err) => {
  
          rej({
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, registering new user.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, registering new user.' }]
        })
      })
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

        response.json()
        .then((data) => {

          if (!response.ok) {
            return rej(data)
          }

          res(data)
        })
        .catch((err) => {
  
          rej({
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, sending registration email.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, sending registration email.' }]
        })
      })
    })
  }

  static verifyRegistration(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/verify-registration`, {
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
        .catch((err) => {
  
          rej({
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, verifying user registration.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, verifying user registration.' }]
        })
      })
    })
  }
}

export default RegistrationProvider
