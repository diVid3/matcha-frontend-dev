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
import NotificationsContainer from './components/targeted_components/App/NotificationsContainer/NotificationsContainer'
import PromiseCancel from './helpers/PromiseCancel'
import UsersProvider from './providers/UsersProvider'
import NotificationsProvider from './providers/NotificationsProvider'
import SessionProvider from './providers/SessionProvider'
import Search from './pages/Search/Search'

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
    padding: '10px'
  }
}

class App extends Component {
  constructor(props) {
    super()

    this.state = {
      modalOpen: false,
      ownInfo: null,
      notifications: [],
      redirectTo: '',
      prevBrowseSearchQuery: ''
    }

    this.pendingPromises = []
    this.prevSearch = ''

    this.openModal = this.openModal.bind(this)
    this.getNotificationData = this.getNotificationData.bind(this)
    this.readAllNotifications = this.readAllNotifications.bind(this)
    this.savePrevSearch = this.savePrevSearch.bind(this)
  }

  savePrevSearch(queryParam) {

    console.log('savePrevSearch called!')

    this.prevSearch = queryParam
  }

  readAllNotifications() {

    // exit if all notifications have already been read.
    if (!this.state.notifications.filter((n) => n.read - 0 === 0).length) {

      return
    }

    const cancelableReadAllNotificationsPromise = PromiseCancel.makeCancelable(
      NotificationsProvider.patchNotificationByUsername({
        read: '1'
      }, this.state.ownInfo.username)
    )

    this.pendingPromises.push(cancelableReadAllNotificationsPromise)

    cancelableReadAllNotificationsPromise.promise
    .then((json) => {

      const newReadNotifications = this.state.notifications.slice()
      newReadNotifications.forEach((n) => n.read = 1)

      this.setState({
        notifications: newReadNotifications
      })
    })
    .catch((json) => {

      console.log('readAllNotificaitons, backend failed to patch unread notifications: ', json)
    })
  }

  getNotificationData() {

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

      const socket = SocketWrapper.getSocket()

      socket.on('fromServerNotification', (data) => {

        if (data.targetUsername === this.state.ownInfo.username) {

          const newNotifications = this.state.notifications.slice()
          newNotifications.unshift(data)

          this.setState({
            notifications: newNotifications
          })
        }
      })
    })
    .catch((json) => {
      sessionStorage.setItem('viewError', '1')
        
      this.setState({
        redirectTo: '/oops'
      })
    })
  }

  openModal() {

    this.setState({
      modalOpen: true
    })
  }

  componentDidMount() {

    console.log('App component has mounted!')

    // This is done so that if the user did already log in, and the browser is refreshed, the sockedID will migrate
    // on the backend.
    SocketWrapper.connectSocket()

    if (
      document.cookie &&
      document.cookie.includes('=') &&
      document.cookie.split('=')[0] === 'sid' &&
      (document.cookie.split('=')[1]).length >= 80 &&
      (document.cookie.split('=')[1]).length <= 100
    ) {

      const cancelableIsLoggedInPromise = PromiseCancel.makeCancelable(
        SessionProvider.isLoggedIn()
      )
  
      this.pendingPromises.push(cancelableIsLoggedInPromise)
  
      cancelableIsLoggedInPromise.promise
      .then((data) => {
  
        if (data.isLoggedIn) {
  
          const cancelableOwnInfoPromise = PromiseCancel.makeCancelable(
            UsersProvider.getSessionUsername()
          )
      
          const cancelableGetNotificationsPromise = PromiseCancel.makeCancelable(
            NotificationsProvider.getNotificationsBySession()
          )

          this.pendingPromises.push(cancelableOwnInfoPromise)
          this.pendingPromises.push(cancelableGetNotificationsPromise)

          return Promise.all([
            cancelableOwnInfoPromise.promise,
            cancelableGetNotificationsPromise.promise
          ])
        }
      })
      .then((json) => {

        if (json) {

          this.setState({
            ownInfo: json[0],
            notifications: json[1].rows
          })

          const socket = SocketWrapper.getSocket()

          socket.on('fromServerNotification', (data) => {

            if (data.targetUsername === this.state.ownInfo.username) {

              const newNotifications = this.state.notifications.slice()
              newNotifications.unshift(data)
    
              this.setState({
                notifications: newNotifications
              })
            }
          })
        }
      })
      .catch((json) => {
  
        sessionStorage.setItem('viewError', '1')
        
        this.setState({
          redirectTo: '/oops'
        })
      })
    }
  }

  componentWillUnmount() {

    SocketWrapper.closeSocket()
  }

  render() {
    return (
      <div className="App">
        <Modal
          isOpen={this.state.modalOpen}
          style={modalStyle}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => this.setState({ modalOpen: false })}
        >
          <NotificationsContainer
            notifications={this.state.notifications}
            readAllNotifications={this.readAllNotifications}
          />
        </Modal>
        <Router>
          {
            this.state.redirectTo
              ? <Redirect to={ this.state.redirectTo } />
              : null
          }
          <Switch>
            <Route path="/oops" component={Oops}/>
            <ProtectedRoute
              path={[
                '/profile',
                '/profile/:username',
                '/settings',
                '/chat',
                '/search'
              ]}
            >
              <header>
                <Navbar openModal={this.openModal} notifications={this.state.notifications}/>
              </header>
              <Route path="/profile" component={Profile} exact/>
              <Route path="/profile/:username" component={Profile}/>
              <Route path="/settings" component={Settings}/>
              <Route path="/chat" component={Chat}/>
              <Route path="/search"
                render={(props) =>
                  <Search
                    {...props}
                    savePrevSearch={this.savePrevSearch}
                    prevSearch={this.prevSearch}
                  />
                }
              />
            </ProtectedRoute>
            <PublicRoute path="/">
              <Landing getNotificationData={this.getNotificationData}/>
            </PublicRoute>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
