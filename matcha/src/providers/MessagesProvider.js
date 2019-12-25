import Config from '../config/Config'

export class MessagesProvider {

  static getFriendMessageFeed(body) {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/messages/friend/id/${body.targetUserID}`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting message feed by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting message feed by session.' }]
        })
      })
    })
  }
}

export default MessagesProvider
