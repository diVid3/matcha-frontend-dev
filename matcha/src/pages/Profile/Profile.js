import React, { Component, Fragment } from 'react'
import { Redirect } from "react-router-dom";
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
import InputValidation from '../../helpers/InputValidation'
import BlockedUsersProvider from '../../providers/BlockedUsersProvider'
import ViewersLikersContainer from '../../components/targeted_components/Profile/ViewersLikersContainer/ViewersLikersContainer'

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
      modalChild: null,
      redirectTo: '',
      isOtherUser: false
    }

    this.pendingPromises = []

    this.handleImageClickDecorator = this.handleImageClickDecorator.bind(this)
    this.handleViewersClick = this.handleViewersClick.bind(this)
    this.handleLikersClick = this.handleLikersClick.bind(this)
  }

  handleViewersClick(e) {

    // TODO: Make call to get content for ViewersLikersContainer, if you have it, setState...
    // remember to change modalChild, you can pass the props through straigt, not let the component
    // take it from the state.
  }

  handleLikersClick(e) {

    // TODO: Make call to get content for ViewersLikersContainer, if you have it, setState...
    // remember to change modalChild, you can pass the props through straigt, not let the component
    // take it from the state.
  }

  handleImageClickDecorator(path) {

    return (e) => {

      if (path === 'default') {
        
        this.setState({
          modalChild: <img className="profile-page-modal-image" src={defaultPic} alt="Modal"/>,
          modalOpen: true
        })
      }
      else {

        this.setState({
          modalChild: <img className="profile-page-modal-image" src={path} alt="Modal"/>,
          modalOpen: true
        })
      }
    }
  }

  async componentDidMount() {

    const cancelableGetOwnUsernamePromise = PromiseCancel.makeCancelable(
      UsersProvider.getSessionUsername()
    )

    this.pendingPromises.push(cancelableGetOwnUsernamePromise)

    let json = await cancelableGetOwnUsernamePromise.promise

    if (
      this.props.match.params &&
      this.props.match.params.username &&
      InputValidation.isValidName(this.props.match.params.username) &&
      typeof json.username === 'string' &&
      json.username !== this.props.match.params.username // If different username than own.
    ) {

      // TODO: Make two requests, getUserByUsername, to see if the user exists, and getBlockedUsersBySession, to see
      // if the current user you're viewing is blocked or not. Use Promise.all to fetch at the same time, upon
      // completion, check whether the user exists, if the user does exist, make sure the user isn't blocked, then
      // display, if the user doesn't exist, display: 'Sorry, that user doesn't exist.', if the user is blocked,
      // display: 'You currently have this user blocked.'
  
      const cancelableGetUserByUsernamePromise = PromiseCancel.makeCancelable(
        UsersProvider.getUserByUsername({
          username: this.props.match.params.username
        })
      )

      const cancelableGetUserPicturesByUsernamePromise = PromiseCancel.makeCancelable(
        PicturesProvider.getPicturesByUsername({
          username: this.props.match.params.username
        })
      )

      const cancelableGetUserTagsByUsernamePromise = PromiseCancel.makeCancelable(
        TagsProvider.getTagsByUsername({
          username: this.props.match.params.username
        })
      )

      const cancelableGetBlockedUsersBySessionPromise = PromiseCancel.makeCancelable(
        BlockedUsersProvider.getBlockedUsersBySession()
      )

      const cancelableGetCanViewUserPromise = PromiseCancel.makeCancelable(
        Promise.all([
          cancelableGetUserByUsernamePromise.promise,
          cancelableGetBlockedUsersBySessionPromise.promise,
          cancelableGetUserPicturesByUsernamePromise.promise,
          cancelableGetUserTagsByUsernamePromise.promise
        ])
      )

      this.pendingPromises.push(cancelableGetCanViewUserPromise)
      this.pendingPromises.push(cancelableGetUserByUsernamePromise)
      this.pendingPromises.push(cancelableGetBlockedUsersBySessionPromise)
      this.pendingPromises.push(cancelableGetUserPicturesByUsernamePromise)
      this.pendingPromises.push(cancelableGetUserTagsByUsernamePromise)

      cancelableGetCanViewUserPromise.promise
      .then((obj) => {

        console.log(obj)

        // If user exists.
        if (obj[0].rows.length) {

          // If the user isn't blocked
          if (!obj[1].rows.some((blockedUser) => obj[0].rows[0].user_id === blockedUser.blocked_id)) {

            // userInfo is obj[0]
            // pictures is obj[2]
            // tags is obj[3]

            let newProfilePicPath = obj[0].rows[0].profile_pic_path ? (`${Config.backend}/` + obj[0].rows[0].profile_pic_path) : ''
            let newPicPath1 = (obj[2].rows[0] && obj[2].rows[0].pic_path) ? (`${Config.backend}/` + obj[2].rows[0].pic_path) : ''
            let newPicPath2 = (obj[2].rows[1] && obj[2].rows[1].pic_path) ? (`${Config.backend}/` + obj[2].rows[1].pic_path) : ''
            let newPicPath3 = (obj[2].rows[2] && obj[2].rows[2].pic_path) ? (`${Config.backend}/` + obj[2].rows[2].pic_path) : ''
            let newPicPath4 = (obj[2].rows[3] && obj[2].rows[3].pic_path) ? (`${Config.backend}/` + obj[2].rows[3].pic_path) : ''

            this.setState({
              isBusy: false,
              userInfo: obj[0].rows[0],
              profilePicPath: newProfilePicPath,
              picPath1: newPicPath1,
              picPath2: newPicPath2,
              picPath3: newPicPath3,
              picPath4: newPicPath4,
              tags: obj[3].rows,
              isOtherUser: true
            })

            const cancelableCreateViewerPromise = PromiseCancel.makeCancelable(
              ViewersProvider.createViewerBySession({
                targetUserID: this.state.userInfo.user_id
              })
            )

            this.pendingPromises.push(cancelableCreateViewerPromise)

            cancelableCreateViewerPromise.promise
            .then((json) => {})
            .catch((json) => {})
          }
          else {

            // Redirect if user is blocked.
            this.setState({
              redirectTo: '/profile'
            })
          }
        }
        else {

          // Redirect if user doesn't exist.
          this.setState({
            redirectTo: '/profile'
          })
        }
      })
    }
    else {

      const cancelableUserInfoPromise = PromiseCancel.makeCancelable(UsersProvider.getUserBySession())
      const cancelablePicturesPromise = PromiseCancel.makeCancelable(PicturesProvider.getPicturesBySession())
      const cancelableTagsPromise = PromiseCancel.makeCancelable(TagsProvider.getTagsBySession())
      const cancelableViewersPromise = PromiseCancel.makeCancelable(ViewersProvider.getViewersBySession())

      const cancelableGetUserDataPromise = PromiseCancel.makeCancelable(
        Promise.all([
          cancelableUserInfoPromise.promise,
          cancelablePicturesPromise.promise,
          cancelableTagsPromise.promise,
          cancelableViewersPromise.promise
        ])
      )
  
      this.pendingPromises.push(cancelableGetUserDataPromise)
      this.pendingPromises.push(cancelableUserInfoPromise)
      this.pendingPromises.push(cancelablePicturesPromise)
      this.pendingPromises.push(cancelableTagsPromise)
      this.pendingPromises.push(cancelableViewersPromise)
  
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

    // TODO: Remember that certain statuses like friends / liked will show if you're viewing anothers profile,
    // the corresponding buttons will need to be enabled, can double up HTML if you want.

    // TODO: When viewing anothers profile, react should pull the username from query params, and on mount will
    // fetch the related data.

    // TODO: The Viewed button can enable the popup again, with the related viewers, i.e. their usernames. The
    // Viewed component would be better off making a request rather than working on old data, since a profile
    // can be loaded, and after a while, a user can receive a view. The Viewers component will need to be scroll
    // able.

    // TODO: To display the Friends status, you'll need to query like below, the same goes for the Liked status,
    // so if you're not friends, no status, if you didn't like them, no liked. In that case, the only button that
    // will display will be 'Like', and when you like the other person's profile, a request is made to the backend,
    // the backend will check if that person is a liker of yours, and if you're a liker of them, if both are true,
    // that person is added to your friends list, and you're added to their friends list. Should you then dislike
    // the person, another request will be made, they will be removed from your friends list, and you will be removed
    // from their friends list, after that, you will be removed as a liker for them.

    // TODO: Add an if to check for the query params, use getUserByUsername to fetch the other user's data.
    // TODO: getUserByUsername <---- CHECK

    // TODO: getPicturesByUsername <---- CHECK

    // TODO: getTagsByUsername <---- CHECK

    // TODO: This will not need to be called if viewing another's profile.
  }

  componentWillUnmount() {

    this.pendingPromises.forEach(p => p.cancel())
  }

  render() {
    return (
      <div className="profile-page">
        {
          this.state.redirectTo
            ? <Redirect to={this.state.redirectTo} />
            : null
        }
        <Modal
          isOpen={this.state.modalOpen}
          style={modalStyle}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => this.setState({ modalOpen: false })}
        >
          {
            this.state.modalChild
          }
        </Modal>
        {
          !this.state.isBusy
            ? <div className="profile-page-grid">
                <div className="profile-page-grid-component profile-page-grid-stats">
                  <div className="profile-page-stats-pp-container">

                    <div className="profile-page-stats-pp-pic-container">
                      <div className="profile-page-picture-aspect-container">
                        <div className="profile-page-picture-aspect-node">
                          <img className="profile-page-stats-pp"
                            src={
                              this.state.profilePicPath
                                ? this.state.profilePicPath
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
                      </div>
                    </div>

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
                  {
                    !this.state.isOtherUser // TODO: These 2 buttons will need to set the modalChild + open it
                      ? <Fragment>
                          <button
                            className="profile-page-grid-buttons-button profile-page-grid-viewed-button"
                            type="button"
                            onClick={this.handleViewersClick}
                          >
                            Viewers
                          </button>
                          <button
                            className="profile-page-grid-buttons-button profile-page-grid-likers-button"
                            type="button"
                            onClick={this.handleLikersClick}
                          >
                            Likers
                          </button>
                        </Fragment>
                      : null // TODO: Display last seen if offline, friends / like / liked, block, report fake
                  }
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
                      this.state.tags.length
                        ? this.state.tags.map(
                            tag => <div className="profile-page-pictures-tags-tag" key={tag.id}>
                              {tag.tag}
                            </div>
                          )
                        : <p className="profile-page-pictures-tags-no-tags-text">No tags</p>
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
