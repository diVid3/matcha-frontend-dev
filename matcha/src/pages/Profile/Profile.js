import React, { Component } from 'react'
import UsersProvider from '../../providers/UsersProvider'
import PicturesProvider from '../../providers/PicturesProvider'
import TagsProvider from '../../providers/TagsProvider'
import ViewersProvider from '../../providers/ViewersProvider'
import PromiseCancel from '../../helpers/PromiseCancel'
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import ParseUserInfo from '../../helpers/ParseUserInfo'
import SimpleMap from '../../components/shared_components/SimpleMap/SimpleMap'
import Modal from 'react-modal'

import './Profile.css';
import defaultpp from '../../assets/placeholder.png'
import defaultPic from '../../assets/placeholder.png'

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

export class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isBusy: true,
      userInfo: null,
      pictures: null,
      tags: null,
      viewers: null,
      modalOpen: false,
      modalImage: ''
    }

    this.pendingPromises = []

    this.handleImageClickDecorator = this.handleImageClickDecorator.bind(this)
  }

  handleImageClickDecorator(path) {

    return (e) => {

      if (path === 'default') {
        
        this.setState({
          modalOpen: true,
          modalImage: 'default'
        })
      }
      else {

        this.setState({
          modalOpen: true,
          modalImage: path
        })
      }
    }
  }

  componentDidMount() {

    // TODO: If viewing someone else's profile, you can't get info by session, need to user another function
    // from these providers, you need to get using their username, since usernames are unique.

    // TODO: Remember that certain statuses like friends / liked will show if you're viewing anothers profile,
    // the corresponding buttons will need to be enabled, can double up HTML if you want.

    // TODO: When viewing anothers profile, react should pull the username from query params, and on mount will
    // fetch the related data.

    // TODO: The Viewed button can enable the popup again, with the related viewers, i.e. their usernames. The
    // Viewed component would be better off making a request rather than working on old data, since a profile
    // can be loaded, and after a while, a user can receive a view. The Viewers component will need to be scroll
    // able.

    // TODO: The edit button will need to show it's own component view instead of the grid.

    const cancelableUserInfoPromise = PromiseCancel.makeCancelable(UsersProvider.getUserBySession())
    const cancelablePicturesPromise = PromiseCancel.makeCancelable(PicturesProvider.getPicturesBySession())
    const cancelableTagsPromise = PromiseCancel.makeCancelable(TagsProvider.getTagsBySession())
    const cancelableViewersPromise = PromiseCancel.makeCancelable(ViewersProvider.getViewersBySession())

    this.pendingPromises.push(cancelableUserInfoPromise)
    this.pendingPromises.push(cancelablePicturesPromise)
    this.pendingPromises.push(cancelableTagsPromise)
    this.pendingPromises.push(cancelableViewersPromise)

    const cancelableGetUserDataPromise = PromiseCancel.makeCancelable(
      Promise.all([
        cancelableUserInfoPromise.promise,
        cancelablePicturesPromise.promise,
        cancelableTagsPromise.promise,
        cancelableViewersPromise.promise
      ])
    )

    this.pendingPromises.push(cancelableGetUserDataPromise)

    cancelableGetUserDataPromise.promise
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

  componentWillUnmount() {

    this.pendingPromises.forEach(p => p.cancel())
  }

  render() {
    return (
      <div className="profile-page">
        <Modal
          isOpen={this.state.modalOpen}
          style={modalStyle}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => this.setState({ modalOpen: false })}
        >
          <img className="profile-page-modal-image"
            src={
              this.state.modalImage === 'default'
                ? defaultPic
                : this.state.modalImage
            }
            alt="Modal"
          />
        </Modal>
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
                        this.state.userInfo.profile_pic_path
                          ? null
                          : defaultpp
                      }
                      alt="Profile"
                      onClick={this.handleImageClickDecorator(`${
                        this.state.userInfo.profile_pic_path
                          ? this.state.userInfo.profile_pic_path
                          : 'default'
                      }`)}
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
                  <div className="profile-page-stats-map-container">
                    <SimpleMap
                      center={{
                        lat: this.state.userInfo.latitude - 0,
                        lng: this.state.userInfo.longitude - 0
                      }}
                    />
                  </div>
                </div>
                <div className="profile-page-grid-component profile-page-grid-buttons">
                  <button
                    className="profile-page-grid-buttons-button profile-page-grid-viewed-button"
                    type="button"
                  >
                    Viewed
                  </button>
                  <button
                    className="profile-page-grid-buttons-button profile-page-grid-edit-button"
                    type="button"
                  >
                    Edit
                  </button> 
                </div>
                <div className="profile-page-grid-component profile-page-grid-pictures">
                  <div className="profile-page-pictures-bio-container">
                    <p className="profile-page-pictures-bio-heading">Bio</p>
                    <p className="profile-page-pictures-bio-text">
                      { this.state.userInfo.biography }
                    </p>
                  </div>
                  <div className="profile-page-pictures-pictures-container">
                    <img className="profile-page-pictures-picture profile-page-pictures-picture-1"
                      src={
                        this.state.pictures[0] && this.state.pictures[0].pic_path
                          ? null
                          : defaultPic
                      }
                      alt="Something"
                      onClick={this.handleImageClickDecorator(`${
                        this.state.pictures[0] && this.state.pictures[0].pic_path
                          ? this.state.pictures[0].pic_path
                          : 'default'
                      }`)}
                    />
                    <img className="profile-page-pictures-picture profile-page-pictures-picture-2"
                      src={
                        this.state.pictures[1] && this.state.pictures[1].pic_path
                          ? null
                          : defaultPic
                      }
                      alt="Something"
                      onClick={this.handleImageClickDecorator(`${
                        this.state.pictures[0] && this.state.pictures[1].pic_path
                          ? this.state.pictures[1].pic_path
                          : 'default'
                      }`)}
                    />
                    <img className="profile-page-pictures-picture profile-page-pictures-picture-3"
                      src={
                        this.state.pictures[2] && this.state.pictures[2].pic_path
                          ? null
                          : defaultPic
                      }
                      alt="Something"
                      onClick={this.handleImageClickDecorator(`${
                        this.state.pictures[0] && this.state.pictures[2].pic_path
                          ? this.state.pictures[2].pic_path
                          : 'default'
                      }`)}
                    />
                    <img className="profile-page-pictures-picture profile-page-pictures-picture-4"
                      src={
                        this.state.pictures[3] && this.state.pictures[3].pic_path
                          ? null
                          : defaultPic
                      }
                      alt="Something"
                      onClick={this.handleImageClickDecorator(`${
                        this.state.pictures[0] && this.state.pictures[3].pic_path
                          ? this.state.pictures[3].pic_path
                          : 'default'
                      }`)}
                    />
                  </div>
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
