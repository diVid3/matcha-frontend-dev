import React from 'react'
import './App.css'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Landing from './pages/Landing/Landing'
import Profile from './pages/Profile/Profile'

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={Landing}/>
        <Route path="/profile" component={Profile}/>
      </div>
    </Router>
  )
}

export default App
