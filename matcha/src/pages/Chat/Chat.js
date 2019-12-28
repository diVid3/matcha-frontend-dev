import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import PromiseCancel from '../../helpers/PromiseCancel'
import ChatSessionsProvider from '../../providers/ChatSessionsProvider'
import MessagesProvider from '../../providers/MessagesProvider'
import ChatCard from '../../components/targeted_components/Chat/ChatCard/ChatCard'
import Config from '../../config/Config'
import UsersProvider from '../../providers/UsersProvider'
import ChatBubble from '../../components/targeted_components/Chat/ChatBubble/ChatBubble'
import SocketWrapper from '../../helpers/SocketWrapper'
import InputValidation from '../../helpers/InputValidation'

import './Chat.css'
import defaultpp from '../../assets/placeholder.png'

export class Chat extends Component {
  constructor(props) {
    super()

    this.state = {
      isBusy: true,
      displayChatCards: true,
      redirectTo: '',
      friendsInfo: null,
      friendFeeds: null,
      lastMessages: null,
      isSelectedUserLoggedIn: false,
      enteredMessage: '',
      selectedFriendFeed: null,
      ownUserData: null,
      enteredMessageValid: true,
    }

    this.pendingPromises = []
    this.selectedFriendIndex = null
    this.canEnterSession = true
    this._isMounted = false

    this.getLastMessageTimeIssued = this.getLastMessageTimeIssued.bind(this)
    this.getLastMessageMessage = this.getLastMessageMessage.bind(this)
    this.handleSelectFriendDecorator = this.handleSelectFriendDecorator.bind(this)
    this.getProfilePicPath = this.getProfilePicPath.bind(this)
    this.handleChatSessionBack = this.handleChatSessionBack.bind(this)
    this.handleEnterMessage = this.handleEnterMessage.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this)
  }

  handleSendMessage(e) {
    e.preventDefault()

    if (!this.state.enteredMessageValid || !this.state.enteredMessage) {

      return
    }

    const messageTimeIssued = +new Date()

    const ownMessage = {
      user_id: this.state.ownUserData.id - 0,
      other_user_id: this.state.friendsInfo[this.selectedFriendIndex].user_id - 0,
      time_issued: messageTimeIssued,
      message: this.state.enteredMessage,
      read: 0,
      username: this.state.ownUserData.username
    }

    const newSelectedFriendFeed = this.state.selectedFriendFeed.slice()
    newSelectedFriendFeed.push(ownMessage)

    const newFriendFeeds = this.state.friendFeeds.slice()
    newFriendFeeds[this.selectedFriendIndex].rows = newSelectedFriendFeed

    const newLastMessages = newFriendFeeds.map((feed) => feed.rows.slice(-1))

    this.setState({
      selectedFriendFeed: newSelectedFriendFeed,
      friendFeeds: newFriendFeeds,
      lastMessages: newLastMessages
    }, () => {
      const chatDiv = document.getElementById('chatToScroll')
      chatDiv.scrollTop = chatDiv.scrollHeight
    })

    const chatMessage = {
      targetUsername: this.state.friendsInfo[this.selectedFriendIndex].username,
      targetUserID: this.state.friendsInfo[this.selectedFriendIndex].user_id + '',
      timeIssued: messageTimeIssued,
      message: this.state.enteredMessage,
      read: 0
    }

    SocketWrapper.getSocket().emit('fromClientChatMessage', chatMessage)

    this.setState({
      enteredMessage: ''
    })
  }

  handleEnterMessage(e) {
    const { value } = e.target

    this.setState({
      enteredMessage: value,
      enteredMessageValid: InputValidation.isValidMessage(value)
    })
  }

  handleChatSessionBack(e) {

    this.canEnterSession = false

    setTimeout(() => this.canEnterSession = true, 300)

    this.setState({
      displayChatCards: true,
      isSelectedUserLoggedIn: false
    })
  }

  getProfilePicPath(basePath) {

    return basePath ? (`${Config.backend}/` + basePath) : ''
  }

  getLastMessageTimeIssued(lastMessage) {
    return lastMessage && lastMessage[0] ? lastMessage[0].time_issued : null
  }

  getLastMessageMessage(lastMessage) {
    return lastMessage && lastMessage[0] ? lastMessage[0].message : ''
  }

  handleSelectFriendDecorator(i) {

    return (e) => {

      if (!this.canEnterSession) {

        return
      }

      this.selectedFriendIndex = i

      const cancelableIsSelectedUserLoggedInPromise = PromiseCancel.makeCancelable(
        UsersProvider.isUserLoggedIn({
          username: this.state.friendsInfo[this.selectedFriendIndex].username
        })
      )

      this.pendingPromises.push(cancelableIsSelectedUserLoggedInPromise)

      cancelableIsSelectedUserLoggedInPromise.promise
      .then((json) => {

        if (json.status) {

          this.setState({
            isSelectedUserLoggedIn: true
          })
        }
      })
      .catch((json) => {})

      this.setState({
        selectedFriendFeed: this.state.friendFeeds[this.selectedFriendIndex].rows,
        displayChatCards: false
      }, () => {
        const chatDiv = document.getElementById('chatToScroll')
        chatDiv.scrollTop = chatDiv.scrollHeight
      })
    }
  }

  componentDidMount() {

    this._isMounted = true

    const cancelableGetOwnUsernamePromise = PromiseCancel.makeCancelable(
      UsersProvider.getSessionUsername()
    )

    this.pendingPromises.push(cancelableGetOwnUsernamePromise)

    cancelableGetOwnUsernamePromise.promise
    .then((json) => {

      this.setState({
        ownUserData: json
      })

      const cancelableGetChatSessionsPromise = PromiseCancel.makeCancelable(
        ChatSessionsProvider.getChatSessionsBySession()
      )
  
      this.pendingPromises.push(cancelableGetChatSessionsPromise)
  
      return cancelableGetChatSessionsPromise.promise
    })
    .then((json) => {

      this.setState({
        friendsInfo: json.rows
      })

      const friendIDs = json.rows.map(friend => friend.user_id)
      const feedPromises = []

      friendIDs.forEach((id) => {
        const cancelableGetMessageFeedsPromise = PromiseCancel.makeCancelable(
          MessagesProvider.getFriendMessageFeed({ targetUserID: id + '' })
        )
        this.pendingPromises.push(cancelableGetMessageFeedsPromise)
        feedPromises.push(cancelableGetMessageFeedsPromise.promise)
      })

      return Promise.all(feedPromises)
    })
    .then((json) => {

      // Skimming off last messages from the friendFeeds array, every index will be another array containing
      // the last message as its first index, so i.e. lastMessages[i][0].
      const lastMessages = json.map((feed) => feed.rows.slice(-1))

      this.setState({
        isBusy: false,
        friendFeeds: json,
        lastMessages
      })

      const socket = SocketWrapper.getSocket()

      socket.on('fromServerChatMessage', (data) => {
        if (this._isMounted && !this.state.displayChatCards) {

          const newSelectedFriendFeed = this.state.selectedFriendFeed.slice()
          newSelectedFriendFeed.push(data)

          const newFriendFeeds = this.state.friendFeeds.slice()
          newFriendFeeds[this.selectedFriendIndex].rows = newSelectedFriendFeed

          const newLastMessages = newFriendFeeds.map((feed) => feed.rows.slice(-1))

          this.setState({
            selectedFriendFeed: newSelectedFriendFeed,
            friendFeeds: newFriendFeeds,
            lastMessages: newLastMessages
          }, () => {
            // Scrolling the div in case new messages
            const chatDiv = document.getElementById('chatToScroll')
            chatDiv.scrollTop = chatDiv.scrollHeight
          })
        }
      })

      socket.on('fromServerUserLoggedIn', (data) => {
        if (this._isMounted && data.username === this.state.friendsInfo[this.selectedFriendIndex].username) {
          this.setState({
            isSelectedUserLoggedIn: true
          })
        }
      })

      socket.on('fromServerUserLoggedOff', (data) => {
        if (this._isMounted && data.username === this.state.friendsInfo[this.selectedFriendIndex].username) {
          this.setState({
            isSelectedUserLoggedIn: false
          })
        }
      })

      console.log(this.state.friendsInfo)
      console.log(this.state.friendFeeds)
      console.log(this.state.lastMessages)
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

    this._isMounted = false

    this.pendingPromises.forEach(p => p.cancel())
  }

  render() {
    return (
      <div className="chat-page">
        {
          this.state.redirectTo
            ? <Redirect to={ this.state.redirectTo } />
            : null
        }
        {
          this.state.isBusy
            ? <div className="chat-page-loading-container">
                <LoadingBlocks/>
              </div>
            : <div className="chat-page-container">
                {
                  this.state.displayChatCards
                    ? <div className="chat-page-chat-cards-container">
                        {
                          this.state.friendsInfo.map((info, i) => 
                            <ChatCard
                              key={info.user_id}
                              profilePicPath={info.profile_pic_path}
                              username={info.username}
                              firstName={info.first_name}
                              lastName={info.last_name}
                              lastMessageDate={this.getLastMessageTimeIssued(this.state.lastMessages[i])}
                              lastMessage={this.getLastMessageMessage(this.state.lastMessages[i])}
                              selectHandler={this.handleSelectFriendDecorator(i)}
                            />
                          )
                        }
                      </div>
                    : <div className="chat-page-chat-session-container">
                        <div className="chat-page-chat-session-bar chat-page-chat-session-top-bar">
                          <div className="chat-page-chat-session-top-bar-left">
                            <div className="chat-page-chat-session-top-bar-left-arrow"
                              onClick={this.handleChatSessionBack}
                            />
                            <img className="chat-page-chat-session-top-bar-left-pp-img"
                              src={
                                this.state.friendsInfo[this.selectedFriendIndex].profile_pic_path
                                  ? this.getProfilePicPath(
                                      this.state.friendsInfo[this.selectedFriendIndex].profile_pic_path
                                    )
                                  : defaultpp
                              }
                              alt="chat session"
                            />
                            <p className="chat-page-chat-session-top-bar-left-name">
                              {
                                this.state.friendsInfo[this.selectedFriendIndex].first_name + ' ' +
                                this.state.friendsInfo[this.selectedFriendIndex].last_name
                              }
                            </p>
                          </div>
                          <div className="chat-page-chat-session-top-bar-right">
                            <p className="chat-page-chat-session-top-bar-right-presence-word">
                              {
                                this.state.isSelectedUserLoggedIn
                                  ? 'Online'
                                  : 'Offline'
                              }
                            </p>
                            <div className={
                              `chat-page-chat-session-top-bar-right-presence ${
                                this.state.isSelectedUserLoggedIn
                                  ? 'chat-page-chat-session-top-bar-right-presence-online'
                                  : 'chat-page-chat-session-top-bar-right-presence-offline'
                              }`}
                            />
                          </div>
                        </div>
                        <div id="chatToScroll" className="chat-page-chat-session-bar chat-page-chat-session-middle-bar">
                          {
                            this.state.selectedFriendFeed.length
                              ? this.state.selectedFriendFeed.map((message, i) =>
                                  <ChatBubble
                                    key={i}
                                    left={message.username === this.state.friendsInfo[this.selectedFriendIndex].username}
                                    text={message.message}
                                    messageDateTime={message.time_issued}
                                  />
                                )
                              : <p className="chat-page-chat-session-no-friends-msg">Say hi to your friend</p>
                          }
                        </div>
                        <div className="chat-page-chat-session-bar chat-page-chat-session-bottom-bar">
                          <form
                            className="chat-page-chat-session-bottom-bar-form"
                            onSubmit={this.handleSendMessage}
                          >
                            <input
                              className={`chat-page-chat-session-bottom-bar-text-input ${
                                !this.state.enteredMessageValid
                                  ? 'input-bad'
                                  : ''
                              }`}
                              type="text"
                              name="enteredMessage"
                              value={this.state.enteredMessage}
                              placeholder="Type a message"
                              onChange={this.handleEnterMessage}
                            />
                            <button
                              className="chat-page-chat-session-bottom-bar-right-arrow"
                              type="submit"
                            />
                          </form>
                        </div>
                      </div>
                }
              </div>
        }
      </div>
    )
  }
}

export default Chat
