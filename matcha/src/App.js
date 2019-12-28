import React, { Component } from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

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

// TODO: Remember to include notifications in mobile Navbar!

class App extends Component {
  constructor(props) {
    super()

    this.state = {
      modalOpen: false
    }

    this.pendingPromises = []

    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal() {

    this.setState({
      modalOpen: true
    })
  }

  componentDidMount() {

    // This is done so that if the user did already log in, and the browser is refreshed, the sockedID will migrate
    // on the backend.
    SocketWrapper.connectSocket()
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
        {/* {
          this.state.modalChild
        } */}
        <p>hi</p>
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
                <Navbar toggleModal={this.toggleModal}/>
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
