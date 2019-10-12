import Config from '../config/Config'

export class RegistrationProvider {

  static registerUser(data) {

    return new Promise((res, rej) => {

      fetch(`${Config.localhost}/api/v1.0/users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => {

        // TODO: Check response here, i.e. status codes, if invalid, send success: false
        console.log(response)
        res(response.json())
      })
      .catch((err) => rej(err))
    })
  }
}

export default RegistrationProvider
