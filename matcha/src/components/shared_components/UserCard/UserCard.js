import React, { Component } from 'react'
import Config from '../../../config/Config'
import { NavLink } from "react-router-dom"
import ParseUserInfo from '../../../helpers/ParseUserInfo'

import './UserCard.css'
import defaultpp from '../../../assets/placeholder.png'

export class UserCard extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }

    this.getProfilePicPath = this.getProfilePicPath.bind(this)
  }

  getProfilePicPath(basePath) {

    return basePath ? (`${Config.backend}/` + basePath) : ''
  }

  render() {
    return (
      <NavLink
        className="user-card"
        to={`/profile/${this.props.userInfo.username}`}
      >
        <div className="user-card-flex-container">
          <img className="user-card-pp"
            src={
              this.props.userInfo.profile_pic_path
                ? this.getProfilePicPath(this.props.userInfo.profile_pic_path)
                : defaultpp
            }
            alt="user profile"
          />
          <div className="user-card-info-container">
            <div className="user-card-stats-container">
                <p className="user-card-stat-block-stat">
                  { `${this.props.userInfo.fame_rating} R` }
                </p>
                <p className="user-card-stat-block-stat">
                  { ParseUserInfo.getGender(this.props.userInfo.gender) }
                </p>
                <p className="user-card-stat-block-stat">
                  { ParseUserInfo.getSexuality(this.props.userInfo.sex_pref) }
                </p>
                <p className="user-card-stat-block-stat">
                  { `${this.props.userInfo.age} Yo` }
                </p>
            </div>
            <div className="user-card-stuff-container">
              <p className="user-card-stuff-username">
                { this.props.userInfo.username }
              </p>
              <p className="user-card-bio-container">
                { this.props.userInfo.biography }
              </p>
            </div>
          </div>
        </div>
      </NavLink>
    )
  }
}

export default UserCard
