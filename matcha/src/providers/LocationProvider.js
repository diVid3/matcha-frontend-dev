export class LocationProvider {

  static getLocation() {

    return new Promise((res, rej) => {

      fetch('http://ip-api.com/json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      .then((response) => {
        response.json()
        .then((data) => {
          res(data)
        })
      })
      .catch((err) => rej(err))
    })
  }
}

export default LocationProvider
