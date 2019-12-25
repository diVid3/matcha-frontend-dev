import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import PromiseCancel from '../../helpers/PromiseCancel'
import ChatSessionsProvider from '../../providers/ChatSessionsProvider'
import MessagesProvider from '../../providers/MessagesProvider'
import ChatCard from '../../components/targeted_components/Chat/ChatCard/ChatCard'

import './Chat.css'

export class Chat extends Component {
  constructor(props) {
    super()

    this.state = {
      isBusy: true,
      displayChatCards: true,
      redirectTo: '',
      friendsInfo: null,
      friendFeeds: null,
      lastMessages: null
    }

    this.pendingPromises = []
    this.selectedFriendIndex = null

    this.getLastMessageTimeIssued = this.getLastMessageTimeIssued.bind(this)
    this.getLastMessageMessage = this.getLastMessageMessage.bind(this)
    this.handleSelectFriendDecorator = this.handleSelectFriendDecorator.bind(this)
  }

  getLastMessageTimeIssued(lastMessage) {
    return lastMessage && lastMessage[0] ? lastMessage[0].time_issued : null
  }

  getLastMessageMessage(lastMessage) {
    return lastMessage && lastMessage[0] ? lastMessage[0].message : ''
  }

  handleSelectFriendDecorator(i) {

    return (e) => {

      this.selectedFriendIndex = i

      this.setState({
        displayChatCards: false
      })

      setTimeout(() => {
        this.setState({
          displayChatCards: true
        })
      }, 5000)
    }
  }

  componentDidMount() {

    // TODO: Fetch chatSessions
    // TODO: After fetching chatSessions, use their id's to get respective messageFeeds

    const cancelableGetChatSessionsPromise = PromiseCancel.makeCancelable(
      ChatSessionsProvider.getChatSessionsBySession()
    )

    this.pendingPromises.push(cancelableGetChatSessionsPromise)

    cancelableGetChatSessionsPromise.promise
    .then((json) => {

      // console.log(json)

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

      // console.log(json)

      const lastMessages = json.map((feed) => feed.rows.slice(-1))

      this.setState({
        isBusy: false,
        friendFeeds: json,
        lastMessages
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
          // TODO: Need to first make component to display friends / chats.
          // TODO: Then double up the HTML to select a friend and enter a chat, hide the chats when a chat is selected.
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
                            // TODO: Add socket listener to overwrite lastMessages[i][0],
                            // a setState will be needed to change props so the cards can re-render on message
                            // received.
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
    
                      </div>
                }
              </div>
        }
      </div>
    )
  }
}

export default Chat
