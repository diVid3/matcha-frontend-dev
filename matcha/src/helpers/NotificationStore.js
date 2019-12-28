import SocketWrapper from './SocketWrapper'
import Config from '../config/Config'

// The main reason this exists is to ensure that one does not receive a notification of
// a new message from the person one is currently chatting to.
let currentPersonChattingTo = ''
const notifications = []

export class NotificationStore {

  static saveCurrentPersonChattingTo(currentPerson) {

    currentPersonChattingTo = currentPerson
  }

  static getCurrentPersonChattingTo() {

    return currentPersonChattingTo
  }


}

export default NotificationStore