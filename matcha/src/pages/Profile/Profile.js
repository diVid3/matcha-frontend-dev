import React, { Component, Fragment } from 'react'
import { Redirect } from "react-router-dom"
import UsersProvider from '../../providers/UsersProvider'
import PicturesProvider from '../../providers/PicturesProvider'
import TagsProvider from '../../providers/TagsProvider'
import ViewersProvider from '../../providers/ViewersProvider'
import LikersProvider from '../../providers/LikersProvider'
import PromiseCancel from '../../helpers/PromiseCancel'
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import ParseUserInfo from '../../helpers/ParseUserInfo'
import SimpleMap from '../../components/shared_components/SimpleMap/SimpleMap'
import Modal from 'react-modal'
import Config from '../../config/Config'
import InputValidation from '../../helpers/InputValidation'
import BlockedUsersProvider from '../../providers/BlockedUsersProvider'
import ViewersLikersContainer from '../../components/targeted_components/Profile/ViewersLikersContainer/ViewersLikersContainer'
import FriendsProvider from '../../providers/FriendsProvider'
import FakeUsersProvider from '../../providers/FakeUsersProvider'
import SocketWrapper from '../../helpers/SocketWrapper'

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
      modalOpen: false,
      modalChild: null,
      redirectTo: '',
      isOtherUser: false,
      hasMeAsFriend: false,
      hasMeAsLiker: false,
      hasReportedFake: false,
      hasBlockedUser: false, // TODO: This should be set on componentDidMount()
      isUserLoggedIn: false
    }

    this.pendingPromises = []
    this.canPressLikeUnlike = true
    this.canPressReportFake = true
    this.canPressBlockUnblockUser = true

    this.handleImageClickDecorator = this.handleImageClickDecorator.bind(this)
    this.handleViewersClick = this.handleViewersClick.bind(this)
    this.handleLikersClick = this.handleLikersClick.bind(this)
    this.handleLike = this.handleLike.bind(this)
    this.handleUnlike = this.handleUnlike.bind(this)
    this.handleReportFake = this.handleReportFake.bind(this)
    this.handleBlockUser = this.handleBlockUser.bind(this)
    this.handleUnblockUser = this.handleUnblockUser.bind(this)
  }

  // TODO: Build handleUnblockUser(e) { ... }
  handleUnblockUser(e) {

    if (!this.canPressBlockUnblockUser) {

      return
    }

    this.canPressBlockUnblockUser = false

    this.setState({
      hasBlockedUser: false
    })

    const cancelableUnblockUserPromise = PromiseCancel.makeCancelable(
      BlockedUsersProvider.deleteBlockedUserBySession({
        targetUserID: this.state.userInfo.user_id + ''
      })
    )

    this.pendingPromises.push(cancelableUnblockUserPromise)

    cancelableUnblockUserPromise.promise
    .then((json) => {

      this.setState({
        hasBlockedUser: false
      })

      this.canPressBlockUnblockUser = true
    })
    .catch((json) => {

      this.setState({
        hasBlockedUser: true
      })

      this.canPressBlockUnblockUser = true
    })
  }

  handleBlockUser(e) {

    if (!this.canPressBlockUnblockUser) {

      return
    }

    this.canPressBlockUnblockUser = false

    this.setState({
      hasBlockedUser: true
    })

    const cancelableBlockUserPromise = PromiseCancel.makeCancelable(
      BlockedUsersProvider.createBlockedUserBySession({
        targetUserID: this.state.userInfo.user_id + ''
      })
    )

    this.pendingPromises.push(cancelableBlockUserPromise)

    cancelableBlockUserPromise.promise
    .then((json) => {

      this.setState({
        hasBlockedUser: true
      })

      this.canPressBlockUnblockUser = true
    })
    .catch((json) => {

      this.setState({
        hasBlockedUser: false
      })

      this.canPressBlockUnblockUser = true
    })
  }

  handleReportFake(e) {

    if (!this.canPressReportFake) {

      return
    }

    this.canPressReportFake = false

    const cancelableReportFakePromise = PromiseCancel.makeCancelable(
      FakeUsersProvider.createFakeUserBySession({
        targetUserID: this.state.userInfo.user_id + ''
      })
    )

    this.pendingPromises.push(cancelableReportFakePromise)

    cancelableReportFakePromise.promise
    .then((json) => {

      this.setState({
        hasReportedFake: true
      })

      setTimeout(() => {

        this.setState({
          hasReportedFake: false
        })
        this.canPressReportFake = true
      }, 3000)
    })
    .catch((json) => {

      this.canPressReportFake = true
    })
  }

  handleLike(e) {

    if (!this.canPressLikeUnlike) {

      return
    }

    this.canPressLikeUnlike = false

    this.setState({
      hasMeAsLiker: true
    })

    const cancelableLikeUserPromise = PromiseCancel.makeCancelable(
      LikersProvider.createLikerBySession({
        targetUserID: this.state.userInfo.user_id + '',
        targetUsername: this.state.userInfo.username
      })
    )

    this.pendingPromises.push(cancelableLikeUserPromise)

    cancelableLikeUserPromise.promise
    .then((json) => {

      if (json.madeFriends) {

        this.setState({
          hasMeAsFriend: true
        })
      }

      this.canPressLikeUnlike = true
    })
    .catch((json) => {

      this.setState({
        hasMeAsLiker: false
      })

      this.canPressLikeUnlike = true
    })
  }

  handleUnlike(e) {

    if (!this.canPressLikeUnlike) {

      return
    }

    this.canPressLikeUnlike = false

    this.setState({
      hasMeAsLiker: false
    })

    const cancelableUnlikeUserPromise = PromiseCancel.makeCancelable(
      LikersProvider.deleteLikerBySession({
        targetUserID: this.state.userInfo.user_id + '',
        targetUsername: this.state.userInfo.username
      })
    )

    this.pendingPromises.push(cancelableUnlikeUserPromise)

    cancelableUnlikeUserPromise.promise
    .then((json) => {

      if (json.unfriended) {

        this.setState({
          hasMeAsFriend: false
        })
      }

      this.canPressLikeUnlike = true
    })
    .catch((json) => {

      this.setState({
        hasMeAsLiker: true
      })

      this.canPressLikeUnlike = true
    })
  }

  handleViewersClick(e) {

    this.setState({
      modalChild: <ViewersLikersContainer displayViewers={true} content={[]} isLoading={true}/>,
      modalOpen: true,
    })

    const cancelableGetViewersPromise = PromiseCancel.makeCancelable(
      ViewersProvider.getViewersBySession()
    )

    this.pendingPromises.push(cancelableGetViewersPromise)

    cancelableGetViewersPromise.promise
    .then((json) => {
      
      this.setState({
        modalChild: <ViewersLikersContainer displayViewers={true} content={json.rows} isLoading={false} />
      })
    })
    .catch((json) => {
      
      this.setState({
        modalChild: <div />,
        modalOpen: false
      })
    })
  }

  handleLikersClick(e) {

    this.setState({
      modalChild: <ViewersLikersContainer displayViewers={false} content={[]} isLoading={true}/>,
      modalOpen: true,
    })

    const cancelableGetLikersPromise = PromiseCancel.makeCancelable(
      LikersProvider.getLikersBySession()
    )

    this.pendingPromises.push(cancelableGetLikersPromise)

    cancelableGetLikersPromise.promise
    .then((json) => {

      this.setState({
        modalChild: <ViewersLikersContainer displayViewers={false} content={json.rows} isLoading={false} />
      })
    })
    .catch((json) => {

      this.setState({
        modalChild: <div />,
        modalOpen: false
      })
    })
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

      const cancelableGetBlockedUsersBySessionPromise = PromiseCancel.makeCancelable(
        BlockedUsersProvider.getBlockedUsersBySession()
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

      const cancelableGetUserFriendsByUsername = PromiseCancel.makeCancelable(
        FriendsProvider.getFriendsByUsername({
          username: this.props.match.params.username
        })
      )

      const cancelableGetLikersByUsernamePromise = PromiseCancel.makeCancelable(
        LikersProvider.getLikersByUsername({
          username: this.props.match.params.username
        })
      )

      // This is for comparisons against the usernames in the users friends collection, if not friends, against
      // the users likers.
      const cancelableGetOwnUsername = PromiseCancel.makeCancelable(
        UsersProvider.getSessionUsername()
      )

      const cancelableGetUserOnlinePromise = PromiseCancel.makeCancelable(
        UsersProvider.isUserLoggedIn({
          username: this.props.match.params.username
        })
      )

      const cancelableGetCanViewUserPromise = PromiseCancel.makeCancelable(
        Promise.all([
          cancelableGetUserByUsernamePromise.promise,
          cancelableGetBlockedUsersBySessionPromise.promise,
          cancelableGetUserPicturesByUsernamePromise.promise,
          cancelableGetUserTagsByUsernamePromise.promise,
          cancelableGetUserFriendsByUsername.promise,
          cancelableGetLikersByUsernamePromise.promise,
          cancelableGetOwnUsername.promise,
          cancelableGetUserOnlinePromise.promise
        ])
      )

      this.pendingPromises.push(cancelableGetCanViewUserPromise)
      this.pendingPromises.push(cancelableGetUserByUsernamePromise)
      this.pendingPromises.push(cancelableGetBlockedUsersBySessionPromise)
      this.pendingPromises.push(cancelableGetUserPicturesByUsernamePromise)
      this.pendingPromises.push(cancelableGetUserTagsByUsernamePromise)
      this.pendingPromises.push(cancelableGetUserFriendsByUsername)
      this.pendingPromises.push(cancelableGetLikersByUsernamePromise)
      this.pendingPromises.push(cancelableGetOwnUsername)
      this.pendingPromises.push(cancelableGetUserOnlinePromise)

      cancelableGetCanViewUserPromise.promise
      .then((obj) => {

        console.log(obj)

        // If user exists.
        if (obj[0].rows.length) {

          // If the user isn't blocked
          // if (!obj[1].rows.some((blockedUser) => obj[0].rows[0].user_id === blockedUser.blocked_id))

          // userInfo is obj[0]
          // blockedUsers is obj[1]
          // pictures is obj[2]
          // tags is obj[3]
          // friends is obj[4]
          // likers is obj[5]
          // loggedInUsername is obj[6]
          // isUserOnline is obj[7]

          let newProfilePicPath = obj[0].rows[0].profile_pic_path ? (`${Config.backend}/` + obj[0].rows[0].profile_pic_path) : ''
          let newPicPath1 = (obj[2].rows[0] && obj[2].rows[0].pic_path) ? (`${Config.backend}/` + obj[2].rows[0].pic_path) : ''
          let newPicPath2 = (obj[2].rows[1] && obj[2].rows[1].pic_path) ? (`${Config.backend}/` + obj[2].rows[1].pic_path) : ''
          let newPicPath3 = (obj[2].rows[2] && obj[2].rows[2].pic_path) ? (`${Config.backend}/` + obj[2].rows[2].pic_path) : ''
          let newPicPath4 = (obj[2].rows[3] && obj[2].rows[3].pic_path) ? (`${Config.backend}/` + obj[2].rows[3].pic_path) : ''

          // TODO: Check if my username is in his friends set, if so, display friends and not like / dislike. Check
          // friends first, then likers.
          const hasMeAsFriendResult = obj[4].rows.some(friend => friend.friend_username === obj[6].username)
          const hasMeAsLikerResult = obj[5].rows.some(liker => liker.liker_username === obj[6].username)

          // Calculating the user's fame_rating
          // obj[0].rows[0].fame_rating = obj[5].rows.length

          // Checking if the user has been blocked before
          let hasBlockedUserResult = false
          if (obj[1].rows.some((blockedUser) => obj[0].rows[0].user_id === blockedUser.blocked_id)) {
            hasBlockedUserResult = true
          }

          // console.log(obj[7])

          this.setState({
            isBusy: false,
            userInfo: obj[0].rows[0],
            profilePicPath: newProfilePicPath,
            picPath1: newPicPath1,
            picPath2: newPicPath2,
            picPath3: newPicPath3,
            picPath4: newPicPath4,
            tags: obj[3].rows,
            isOtherUser: true,
            hasMeAsFriend: hasMeAsFriendResult,
            hasMeAsLiker: hasMeAsLikerResult,
            hasBlockedUser: hasBlockedUserResult,
            isUserLoggedIn: obj[7].status
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

          const socket = SocketWrapper.getSocket()

          socket.on('fromServerUserLoggedIn', (data) => {
            if (data.username === this.props.match.params.username) {
              this.setState({
                isUserLoggedIn: true
              })
            }
          })

          socket.on('fromServerUserLoggedOff', (data) => {
            if (data.username === this.props.match.params.username) {
              this.setState({
                isUserLoggedIn: false
              })
            }
          })
        }
        else {

          // Redirect if user doesn't exist.
          this.setState({
            redirectTo: '/profile'
          })
        }
      })
      .catch((err) => {

        console.log(err)
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
          tags: obj[2].rows
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
                          {
                            this.state.hasMeAsFriend
                              ? <p className="profile-page-picture-aspect-container-statuses-friend">Friend</p>
                              : null
                          }
                          {
                            this.state.isUserLoggedIn
                              ? <div className="profile-page-picture-aspect-container-statuses-online"/>
                              : null // TODO: Could possibly have a red circle here
                          }
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
                    !this.state.isOtherUser
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
                      : <Fragment>
                          {
                            // Display last seen 1st if offline.
                          }
                          <button
                            className={`profile-page-grid-buttons-button profile-page-grid-report-fake-button ${
                              this.state.hasReportedFake
                                ? 'profile-page-grid-report-fake-button-success'
                                : ''
                            }`}
                            type="button"
                            onClick={this.handleReportFake}
                          >
                            {
                              this.state.hasReportedFake
                                ? 'Reported'
                                : 'Report fake'
                            }
                          </button>
                          {
                            this.state.hasBlockedUser
                              ? <button
                                  className="profile-page-grid-buttons-button profile-page-grid-unblock-button"
                                  type="button"
                                  onClick={this.handleUnblockUser}
                                >
                                  Unblock
                                </button>
                              : <button
                                  className="profile-page-grid-buttons-button profile-page-grid-block-button"
                                  type="button"
                                  onClick={this.handleBlockUser}
                                >
                                  Block
                                </button>
                          }
                          {
                            this.state.hasMeAsLiker
                              ? <button
                                  className="profile-page-grid-buttons-button profile-page-grid-unlike-button"
                                  type="button"
                                  onClick={this.handleUnlike}
                                >
                                  Unlike
                                </button>
                              : <button
                                  className="profile-page-grid-buttons-button profile-page-grid-like-button"
                                  type="button"
                                  onClick={this.handleLike}
                                >
                                  Like
                                </button>
                          }
                        </Fragment>
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
