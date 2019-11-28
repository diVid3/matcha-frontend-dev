import Config from '../config/Config'

export class PicturesProvider {

  static getPicturesBySession() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/pictures/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting pictures by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting pictures by session.' }]
        })
      })
    })
  }
}

export default PicturesProvider
