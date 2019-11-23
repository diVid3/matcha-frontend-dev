import React from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import ProtectedRoute from './components/shared_components/ProtectedRoute/ProtectedRoute'
import Landing from './pages/Landing/Landing'
import Profile from './pages/Profile/Profile'
import Oops from './pages/Oops/Oops'
import Navbar from './components/shared_components/Navbar/Navbar'

function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          {/* TODO: Need to wrap the public routes as well, for if they're logged in, but before that
                    build the navbar and profile first so that can be used for testing.*/}
          <Route path="/" exact component={Landing}/>
          <Route path="/oops" component={Oops}/>
          <ProtectedRoute path="/">
            <header>
              <Navbar />
            </header>
            <Route path="/profile" component={Profile} />
            <Route path="/lol">
              <div>quack</div>
            </Route>
          </ProtectedRoute>
          {/* <ProtectedRoute path="/profile">
            <Profile />
          </ProtectedRoute> */}
          {/* <Route path="/profile" component={Profile}/> */}
        </Switch>
      </div>
    </Router>
  )
}

export default App
