import Config from '../config/Config'
import SocketWrapper from '../helpers/SocketWrapper'

export class SessionProvider {

  static login(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/login`, {
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

          // This is done because a socket is already open and logging in will create an entry in the socketStore
          // on the backend and this will not keep an open socket around.
          SocketWrapper.closeSocket()
          SocketWrapper.connectSocket()

          // At this point, the socket connection should be open.
          SocketWrapper.getSocket().emit('fromClientUserLoggedIn', {
            username: data.username
          })

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

  static logout(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/logout`, {
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

          SocketWrapper.getSocket().emit('fromClientUserLoggedOff', {
            username: data.username
          })
          SocketWrapper.closeSocket()

          res(data)
        })
        .catch((err) => {
  
          rej({
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, loging out.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, loging out.' }]
        })
      })
    })
  }

  static isLoggedIn() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/logged-in`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, is logged in.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, is logged in.' }]
        })
      })
    })
  }
}

export default SessionProvider
