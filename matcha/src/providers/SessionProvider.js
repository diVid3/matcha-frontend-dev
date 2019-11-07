import Config from '../config/Config'

export class SessionProvider {

  static login(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/login`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, loging in.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, loging in.' }]
        })
      })
    })
  }
}

export default SessionProvider
