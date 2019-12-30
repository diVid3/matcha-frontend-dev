import Config from '../config/Config'

export class UsersProvider {

  static getSessionUsername() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/session/own-username`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting username by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting username by session.' }]
        })
      })
    })
  }

  static isUserLoggedIn(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/logged-in/${body.username}`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting logged-in by username.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting logged-in by username.' }]
        })
      })
    })
  }

  static getAllUsers() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting all users.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting all users.' }]
        })
      })
    })
  }

  static getAllUsersAndTags() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/tags`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting all users and tags.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting all users and tags.' }]
        })
      })
    })
  }

  static getUserByUsername(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/username/${body.username}`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting user by username.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting user by username.' }]
        })
      })
    })
  }

  static getUserByEmail(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/email/${body.email}`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting user by email.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting user by email.' }]
        })
      })
    })
  }

  static getUserBySession() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting user by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting user by session.' }]
        })
      })
    })
  }

  static patchUserByEmail(body, targetEmail) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/email/${targetEmail}`, {
        method: 'PATCH',
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, patching user by email.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, patching user by email.' }]
        })
      })
    })
  }

  static patchUserBySession(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/users/session`, {
        method: 'PATCH',
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, patching user by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, patching user by session.' }]
        })
      })
    })
  }
}

export default UsersProvider
