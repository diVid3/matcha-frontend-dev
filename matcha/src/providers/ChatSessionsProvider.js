import Config from '../config/Config'

export class ChatSessionsProvider {

  static getChatSessionsBySession() {

    return new Promise((res, rej) => {

      fetch(`${Config.backend}/api/v1.0/chat-sessions/session`, {
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
            errors: [{ code: 'PROVIDER', message: 'Fetch (converting json) failed, getting chat sessions by session.' }]
          })
        })
      })
      .catch((err) => {

        rej({
          errors: [{ code: 'PROVIDER', message: 'Fetch failed, getting chat sessions by session.' }]
        })
      })
    })
  }
}

export default ChatSessionsProvider
