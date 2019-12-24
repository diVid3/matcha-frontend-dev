import io from 'socket.io-client'
import Config from '../config/Config'

let socket = null

export class SocketWrapper {

  static connectSocket() {

    socket = io.connect(Config.backend)
  }

  static getSocket() {

    return socket
  }

  static closeSocket() {

    if (socket) {

      socket.close()
    }
  }
}

export default SocketWrapper