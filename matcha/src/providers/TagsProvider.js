import Config from '../config/Config'

export class TagsProvider {

  static getTagsBySession() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/tags/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting tags by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting tags by session.' }]
        })
      })
    })
  }

  // body will be like: { tag: 'cooking' }
  static createTagBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/tags/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, creating tag by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, creating tag by session.' }]
        })
      })
    })
  }

  // body will be like: { tag: 'cooking' }
  static deleteTagBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/tags/session`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, deleting tag by ID.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, deleting tag by ID.' }]
        })
      })
    })
  }
}

export default TagsProvider
