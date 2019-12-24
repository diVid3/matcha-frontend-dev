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

class App extends Component {

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
        <Router>
          <Switch>
            <Route path="/oops" component={Oops}/>
            <ProtectedRoute path={['/profile', '/profile/:username', '/settings']}>
              <header>
                <Navbar />
              </header>
              <Route path="/profile" component={Profile} exact/>
              <Route path="/profile/:username" component={Profile}/>
              <Route path="/settings" component={Settings}/>
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
