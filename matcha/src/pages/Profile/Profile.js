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
import Config from '../../config/Config'

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
      profilePicPath: '',
      picPath1: '',
      picPath2: '',
      picPath3: '',
      picPath4: '',
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

      let newProfilePicPath = obj[0].rows[0].profile_pic_path ? (`${Config.backend}/` + obj[0].rows[0].profile_pic_path) : ''
      let newPicPath1 = (obj[1].rows[0] && obj[1].rows[0].pic_path) ? (`${Config.backend}/` + obj[1].rows[0].pic_path) : ''
      let newPicPath2 = (obj[1].rows[1] && obj[1].rows[1].pic_path) ? (`${Config.backend}/` + obj[1].rows[1].pic_path) : ''
      let newPicPath3 = (obj[1].rows[2] && obj[1].rows[2].pic_path) ? (`${Config.backend}/` + obj[1].rows[2].pic_path) : ''
      let newPicPath4 = (obj[1].rows[3] && obj[1].rows[3].pic_path) ? (`${Config.backend}/` + obj[1].rows[3].pic_path) : ''

      this.setState({
        isBusy: false,
        userInfo: obj[0].rows[0],
        profilePicPath: newProfilePicPath,
        picPath1: newPicPath1,
        picPath2: newPicPath2,
        picPath3: newPicPath3,
        picPath4: newPicPath4,
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
                  <div className="profile-page-stats-pp-container">
                    <img className="profile-page-stats-pp"
                      src={
                        this.state.userInfo.profile_pic_path
                          ? null
                          : defaultpp
                      }
                      alt="Profile"
                      onClick={this.handleImageClickDecorator(`${
                        this.state.profilePicPath
                          ? this.state.profilePicPath
                          : 'default'
                      }`)}
                    />
                  </div>
                  <div className="profile-page-stats-title">
                    <p className="profile-page-stats-name">
                      { this.state.userInfo.first_name + ' ' + this.state.userInfo.last_name }
                    </p>
                    <p className="profile-page-stats-username">
                      { this.state.userInfo.username }
                    </p>
                  </div>
                  <div className="profile-page-stats-map-container">
                    <SimpleMap
                      center={{
                        lat: this.state.userInfo.latitude - 0,
                        lng: this.state.userInfo.longitude - 0
                      }}
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
                  <button
                    className="profile-page-grid-buttons-button profile-page-grid-viewed-button"
                    type="button"
                  >
                    Viewed
                  </button>
                </div>
                <div className="profile-page-grid-component profile-page-grid-pictures">
                  <div className="profile-page-pictures-pictures-container">

                    <div className="profile-page-pictures-picture-container">
                      <div className="profile-page-picture-aspect-container">
                        <div className="profile-page-picture-aspect-node">
                          <img className="profile-page-pictures-picture"
                            src={
                              this.state.picPath1
                                ? this.state.picPath1
                                : defaultPic
                            }
                            alt="Something"
                            onClick={this.handleImageClickDecorator(`${
                              this.state.picPath1
                                ? this.state.picPath1
                                : 'default'
                            }`)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="profile-page-pictures-picture-container">
                      <div className="profile-page-picture-aspect-container">
                        <div className="profile-page-picture-aspect-node">
                          <img className="profile-page-pictures-picture"
                            src={
                              this.state.picPath2
                                ? this.state.picPath2
                                : defaultPic
                            }
                            alt="Something"
                            onClick={this.handleImageClickDecorator(`${
                              this.state.picPath2
                                ? this.state.picPath2
                                : 'default'
                            }`)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="profile-page-pictures-picture-container">
                      <div className="profile-page-picture-aspect-container">
                        <div className="profile-page-picture-aspect-node">
                          <img className="profile-page-pictures-picture"
                            src={
                              this.state.picPath3
                                ? this.state.picPath3
                                : defaultPic
                            }
                            alt="Something"
                            onClick={this.handleImageClickDecorator(`${
                              this.state.picPath3
                                ? this.state.picPath3
                                : 'default'
                            }`)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="profile-page-pictures-picture-container">
                      <div className="profile-page-picture-aspect-container">
                        <div className="profile-page-picture-aspect-node">
                          <img className="profile-page-pictures-picture"
                            src={
                              this.state.picPath4
                                ? this.state.picPath4
                                : defaultPic
                            }
                            alt="Something"
                            onClick={this.handleImageClickDecorator(`${
                              this.state.picPath4
                                ? this.state.picPath4
                                : 'default'
                            }`)}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="profile-page-pictures-tags-container">
                    <p className="profile-page-pictures-tags-heading">Tags</p>
                    {
                      this.state.tags.map(
                        tag => <div className="profile-page-pictures-tags-tag" key={tag.id}>
                          {tag.tag}
                        </div>
                      )
                    }
                  </div>
                  <div className="profile-page-pictures-bio-container">
                    <p className="profile-page-pictures-bio-heading">Bio</p>
                    <p className="profile-page-pictures-bio-text">
                      { this.state.userInfo.biography }
                    </p>
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
