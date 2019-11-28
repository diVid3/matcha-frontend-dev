import React, { Component } from 'react'
import UsersProvider from '../../providers/UsersProvider'
import PicturesProvider from '../../providers/PicturesProvider'
import TagsProvider from '../../providers/TagsProvider'
import ViewersProvider from '../../providers/ViewersProvider'
import PromiseCancel from '../../helpers/PromiseCancel'
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import ParseUserInfo from '../../helpers/ParseUserInfo'

import './Profile.css';
import defaultpp from '../../assets/user2.png'

export class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isBusy: true,
      userInfo: null,
      pictures: null,
      tags: null,
      viewers: null
    }

    this.pendingPromises = []

    // TODO: Bind functions here
  }

  componentDidMount() {

    // TODO: If not all promises resolved, display isBusy animation, quick and dirty spinner.

    const cancelableUserInfoPromise = PromiseCancel.makeCancelable(UsersProvider.getUserBySession())
    const cancelablePicturesPromise = PromiseCancel.makeCancelable(PicturesProvider.getPicturesBySession())
    const cancelableTagsPromise = PromiseCancel.makeCancelable(TagsProvider.getTagsBySession())
    const cancelableViewersPromise = PromiseCancel.makeCancelable(ViewersProvider.getViewersBySession())

    this.pendingPromises.push(cancelableUserInfoPromise)
    this.pendingPromises.push(cancelablePicturesPromise)
    this.pendingPromises.push(cancelableTagsPromise)
    this.pendingPromises.push(cancelableViewersPromise)

    Promise.all([
      cancelableUserInfoPromise.promise,
      cancelablePicturesPromise.promise,
      cancelableTagsPromise.promise,
      cancelableViewersPromise.promise
    ])
    .then((obj) => {

      console.log(obj)

      this.setState({
        isBusy: false,
        userInfo: obj[0].rows[0],
        pictures: obj[1].rows,
        tags: obj[2].rows,
        viewers: obj[3].rows
      })
    })
    .catch((json) => {

      sessionStorage.setItem('viewError', '1')

      this.setState({
        isBusy: false,
        redirectTo: '/oops'
      })
    })
  }

  render() {
    return (
      <div className="profile-page">
        {
          !this.state.isBusy
            ? <div className="profile-page-grid">
                <div className="profile-page-grid-component profile-page-grid-stats">
                  <div className="profile-page-stats-title">
                    <p className="profile-page-stats-name">
                      { this.state.userInfo.first_name + ' ' + this.state.userInfo.last_name }
                    </p>
                    <p className="profile-page-stats-username">
                      { this.state.userInfo.username }
                    </p>
                  </div>
                  <div className="profile-page-stats-pp-container">
                    <img className="profile-page-stats-pp"
                      src={
                        this.state.profile_pic_path
                          ? null
                          : defaultpp
                      }
                      alt="Profile"
                    />
                  </div>
                  <div className="profile-page-stats-stats-container">
                    <div className="profile-page-stat-container">
                      <p className="profile-page-stat-heading">Rating</p>
                      <p className="profile-page-stat-stat">
                        { this.state.userInfo.fame_rating }
                      </p>
                    </div>
                    <div className="profile-page-stat-container">
                      <p className="profile-page-stat-heading">Sex</p>
                      <p className="profile-page-stat-stat">
                        { ParseUserInfo.getGender(this.state.userInfo.gender) }
                      </p>
                    </div>
                    <div className="profile-page-stat-container">
                      <p className="profile-page-stat-heading">Sexuality</p>
                      <p className="profile-page-stat-stat">
                        { ParseUserInfo.getSexuality(this.state.userInfo.sex_pref) }
                      </p>
                    </div>
                    <div className="profile-page-stat-container">
                      <p className="profile-page-stat-heading">Age</p>
                      <p className="profile-page-stat-stat">
                        { this.state.userInfo.age }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="profile-page-grid-component profile-page-grid-buttons">
                  buttons
                </div>
                <div className="profile-page-grid-component profile-page-grid-pictures">
                  pictures
                </div>
              </div>
            : <div className="profile-page-loading-container">
                <LoadingBlocks/>
              </div>
        }
      </div>
    )
  }
}

export default Profile
