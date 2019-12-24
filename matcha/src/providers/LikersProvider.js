import Config from '../config/Config'

export class LikersProvider {

  static getLikersBySession() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/likers/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting likers by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting likers by session.' }]
        })
      })
    })
  }

  static getLikersByUsername(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/likers/username/${body.username}`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting likers by username.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting likers by username.' }]
        })
      })
    })
  }

  // TODO: This will need { targetUserID: userInfo.user_id, targetUsername: userInfo.username }
  static createLikerBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/likers/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, creating liker by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, creating liker by session.' }]
        })
      })
    })
  }

  // TODO: Need to create deleteLikerBySession, with the following api: { targetUserID: userInfo.user_id }
  static deleteLikerBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/likers/session`, {
        method: 'DELETE',
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, deleting liker by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, deleting liker by session.' }]
        })
      })
    })
  }
}

export default LikersProvider
