import io from 'socket.io-client'
import Config from '../config/Config'

// The point of this closure / pipeline / common-space is to facilitate communication
// between the current chat session and the notification system.
//
// The main reason this exists is to ensure that one does not receive a notification of
// a new message from the person one is currently chatting to.

let currentPersonChattingTo = ''

export class ChatNotificationPipeline {

  static saveCurrentPersonChattingTo(currentPerson) {

    currentPersonChattingTo = currentPerson
  }

  static getCurrentPersonChattingTo() {

    return currentPersonChattingTo
  }
}

export default ChatNotificationPipeline