import React, { Component } from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Redirect } from "react-router-dom";

import ProtectedRoute from './components/shared_components/ProtectedRoute/ProtectedRoute'
import PublicRoute from './components/shared_components/PublicRoute/PublicRoute'
import Landing from './pages/Landing/Landing'
import Profile from './pages/Profile/Profile'
import Settings from './pages/Settings/Settings'
import Oops from './pages/Oops/Oops'
import Navbar from './components/shared_components/Navbar/Navbar'
import SocketWrapper from './helpers/SocketWrapper'
import Chat from './pages/Chat/Chat'
import Modal from 'react-modal'
import NotificationsContainer from './components/targeted_components/NotificationsContainer/NotificationsContainer'
import PromiseCancel from './helpers/PromiseCancel'
import UsersProvider from './providers/UsersProvider'
import NotificationsProvider from './providers/NotificationsProvider'

Modal.setAppElement('#root');

const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '10px',
    maxHeight: '60vh'
  }
}

// TODO: Remember to include notifications in mobile Navbar!

class App extends Component {
  constructor(props) {
    super()

    this.state = {
      modalOpen: false,
      ownInfo: null,
      notifications: [],
      redirectTo: ''
    }

    this.pendingPromises = []

    this.openModal = this.openModal.bind(this)
  }

  openModal() {

    this.setState({
      modalOpen: true
    })
  }

  componentDidMount() {

    // This is done so that if the user did already log in, and the browser is refreshed, the sockedID will migrate
    // on the backend.
    SocketWrapper.connectSocket()

    const cancelableOwnInfoPromise = PromiseCancel.makeCancelable(
      UsersProvider.getSessionUsername()
    )

    const cancelableGetNotificationsPromise = PromiseCancel.makeCancelable(
      NotificationsProvider.getNotificationsBySession()
    )

    this.pendingPromises.push(cancelableOwnInfoPromise)
    this.pendingPromises.push(cancelableGetNotificationsPromise)

    Promise.all([
      cancelableOwnInfoPromise.promise,
      cancelableGetNotificationsPromise.promise
    ])
    .then((json) => {

      this.setState({
        ownInfo: json[0],
        notifications: json[1].rows
      })

      // TODO: Listen to the socket events here.
    })
    .catch((json) => {

      sessionStorage.setItem('viewError', '1')
  
      this.setState({
        redirectTo: '/oops'
      })
    })

    // const socket = SocketWrapper.getSocket()

    // TODO: When the app mounts, the notification store should fetch the previous notifications stored in the db
    // as well setting up the listeners for new notifications using the SocketWrapper, the notificationContainer
    // simply projects the contents of the notification store. The notification icons will simply display a bubble
    // if any of the notifications in the notification store is unread, i.e. it'll simply be a count of the unread
    // notifications. When a new notification is received and the notification container is unmounted (modal closed)
    // the notification will be unread. If you receive any notification whilst the notificationContainer is mounted,
    // that notification will be read. The determining of a notification being read or unread should be done before
    // that notification is commited to the DB. When the notificationContainer mounts, it should pull all the
    // notifications from the notification store and check which one's is not read, they should be collected and
    // a promise.all patch request should fire to change their status from unread to read in the DB.
  }

  componentWillUnmount() {

    SocketWrapper.closeSocket()
  }

  render() {
    return (
      <div className="App">
        {
          this.state.redirectTo
            ? <Redirect to={this.state.redirectTo} />
            : null
        }
        <Modal
          isOpen={this.state.modalOpen}
          style={modalStyle}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => this.setState({ modalOpen: false })}
        >
          <NotificationsContainer />
        </Modal>
        <Router>
          <Switch>
            <Route path="/oops" component={Oops}/>
            <ProtectedRoute
              path={[
                '/profile',
                '/profile/:username',
                '/settings',
                '/chat'
              ]}
            >
              <header>
                <Navbar openModal={this.openModal}/>
              </header>
              <Route path="/profile" component={Profile} exact/>
              <Route path="/profile/:username" component={Profile}/>
              <Route path="/settings" component={Settings}/>
              <Route path="/chat" component={Chat}/>
            </ProtectedRoute>
            <PublicRoute path="/">
              <Landing />
            </PublicRoute>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
