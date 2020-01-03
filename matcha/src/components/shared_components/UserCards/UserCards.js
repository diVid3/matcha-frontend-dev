import React, { Component } from 'react'
import UserCard from '../UserCard/UserCard'
// import { Redirect } from "react-router-dom";

import './UserCards.css'

export class UserCards extends Component {
  constructor(props) {
    super()

    this.state = {
      redirectTo: ''
    }

    // this.viewUserProfileRedirect = this.viewUserProfileRedirect.bind(this)
  }

  // viewUserProfileRedirect(username) {
  //   this.setState({
  //     redirectTo: `/profile/${username}`
  //   })
  // }

  render() {
    return (
      <div className="user-cards-container">
        {/* {
          this.state.redirectTo
            ? <Redirect to={ this.state.redirectTo } />
            : null
        } */}
        {
          this.props.data.map((user, i) => 
            <UserCard
              key={user.user_id}
              userInfo={user}
              viewProfileFunc={this.viewUserProfileRedirect}
            />
          )
        }
      </div>
    )
  }
}

export default UserCards
