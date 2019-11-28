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
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Landing}/>
          <Route path="/oops" component={Oops}/>
          <ProtectedRoute path="/">
            <header>
              <Navbar />
            </header>
            <Route path="/profile" component={Profile}/>
          </ProtectedRoute>
        </Switch>
      </Router>
    </div>
  )
}

export default App
