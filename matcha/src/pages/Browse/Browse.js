import React, { Component } from 'react'
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import UsersProvider from '../../providers/UsersProvider'
import { Redirect } from 'react-router-dom'
import PromiseCancel from '../../helpers/PromiseCancel'
import UserSortAndFilter from '../../helpers/UserSortAndFilter'
import UserFilter from '../../components/shared_components/UserFilter/UserFilter'
import UserSort from '../../components/shared_components/UserSort/UserSort'
import UserCards from '../../components/shared_components/UserCards/UserCards'
import BlockedUsersProvider from '../../providers/BlockedUsersProvider'
import getDistance from 'geolib/es/getDistance';
import TagsProvider from '../../providers/TagsProvider'

import './Browse.css'

export class Browse extends Component {
  constructor(props) {
    super()

    this.state = {
      isBusy: true,
      redirectTo: '',
      data: null
    }

    this.pendingPromises = []
    this.ownInfo = null
    this.allUsersAndTags = null
    this.myTags = []

    this.getNormalFilterConfig = this.getNormalFilterConfig.bind(this)
    this.getSortConfig = this.getSortConfig.bind(this)
  }

  getSortConfig(queryParam) {

    const cleanQueryParam = this.props.location.search.replace(/[?&]sort=[\w]+/g, '')

    if (!this.props.location.search || this.props.location.search.includes('?sort')) {

      queryParam = '?' + queryParam.replace(/&/g, '')
    }

    this.props.history.push('/browse' + cleanQueryParam + queryParam)
    this.props.savePrevBrowse(cleanQueryParam + queryParam)

    // The sort should affect the filtered result, not the original DB pull of data.
    const newSortedData = this.state.data.slice()
  
    UserSortAndFilter.sortData(cleanQueryParam + queryParam, this.ownInfo, newSortedData)

    this.setState({
      data: newSortedData
    })
  }

  getNormalFilterConfig(queryParam) {

    if (this.props.location.search.includes('sort')) {
      const weirdArr = this.props.location.search.split('sort=')
      queryParam += '&sort=' + weirdArr[1]
    }

    this.props.history.push('/browse' + queryParam)
    this.props.savePrevBrowse(queryParam)

    // This is to ensure that the filter is idempotent.
    const newData = UserSortAndFilter.filterData(queryParam, this.ownInfo, this.allUsersAndTags)
    UserSortAndFilter.sortData(queryParam, this.ownInfo, newData)

    this.setState({
      data: newData
    })
  }

  componentDidMount() {

    const cancelableGetOwnInfoPromise = PromiseCancel.makeCancelable(
      UsersProvider.getSessionUsername()
    )

    const cancelableGetAllUsersAndTagsPromise = PromiseCancel.makeCancelable(
      UsersProvider.getAllUsersAndTags()
    )

    const cancelableGetBlockedUsersPromise = PromiseCancel.makeCancelable(
      BlockedUsersProvider.getBlockedUsersBySession()
    )

    const cancelableGetOwnTagsPromise = PromiseCancel.makeCancelable(
      TagsProvider.getTagsBySession()
    )

    this.pendingPromises.push(cancelableGetOwnInfoPromise)
    this.pendingPromises.push(cancelableGetAllUsersAndTagsPromise)
    this.pendingPromises.push(cancelableGetBlockedUsersPromise)
    this.pendingPromises.push(cancelableGetOwnTagsPromise)

    Promise.all([
      cancelableGetOwnInfoPromise.promise,
      cancelableGetAllUsersAndTagsPromise.promise,
      cancelableGetBlockedUsersPromise.promise,
      cancelableGetOwnTagsPromise.promise
    ])
    .then((json) => {

      json[1].rows.some((user) => {
        if (user.username === json[0].username) {
          this.ownInfo = user
        }
        return user.username === json[0].username
      })

      if (!this.ownInfo) {
        throw new Error('couldn\'t find own user data for the search filter!')
      }

      this.allUsersAndTags = UserSortAndFilter.flattenUsersAndTags(json[1].rows.filter((user) => user.username !== this.ownInfo.username))

      // Filtering out blocked users
      const blockedUsers = json[2].rows
      this.allUsersAndTags = this.allUsersAndTags.filter((user) => !blockedUsers.some((blocked) => user.username === blocked.blocked_username))

      // Filtering out other sexual preferences
      this.allUsersAndTags = this.allUsersAndTags.filter((user) => user.sex_pref === this.ownInfo.sex_pref)

      // Removing nulls from the user's tags
      this.allUsersAndTags.forEach((user) => {
        user.tags = user.tags.filter((tag) => tag !== null)
      })

      // Consolidating my tags
      json[3].rows.forEach((tagObj) => {
        this.myTags.push(tagObj.tag)
      })

      // + 1 point for each meter away from me
      // + 1 point for each tag that isn't in my tag list
      // + 1 point for each fame_rating point below mine
      // Then sort from low to high, lower being better.

      this.allUsersAndTags.forEach((user) => {

        let browseRanking = 0

        const myCoords = { latitude: this.ownInfo.latitude, longitude: this.ownInfo.longitude }
        const userCoords = { latitude: user.latitude, longitude: user.longitude }
        const distFromMe = getDistance(myCoords, userCoords) // This is in m, not km, but only rates matter, not dist.

        browseRanking += distFromMe

        let myTagsCopy = this.myTags.slice()
        user.tags.forEach((tag) => {
          if (myTagsCopy.includes(tag)) {
            myTagsCopy[myTagsCopy.indexOf(tag)] = ''
          }
        })
        let unmutatedTagsRemaining = 0
        myTagsCopy.forEach((tag) => {
          if (tag) {
            unmutatedTagsRemaining += 1
          }
        })

        browseRanking += unmutatedTagsRemaining

        // Assuming my fame_rating is higher always
        const fameRateDiff = this.ownInfo.fame_rating - user.fame_rating

        // If mine is lower, it'll actually subtract, which is good, lower is better in final sort
        browseRanking += fameRateDiff

        user.browseRanking = browseRanking
      })

      this.allUsersAndTags.sort((prevUser, nextUser) => prevUser.browseRanking - nextUser.browseRanking)

      let newData = null

      if (
        this.props.location.search &&
        this.props.prevBrowse &&
        this.props.location.search === this.props.prevBrowse
      ) {

        // This is required so that when the component mounts and finds a previous config, the full DB userbase isn't lost
        newData = UserSortAndFilter.filterData(this.props.location.search, this.ownInfo, this.allUsersAndTags.slice())
        if (this.props.location.search.includes('sort')) {
          UserSortAndFilter.sortData(this.props.location.search, this.ownInfo, newData)
        }
      }

      this.setState({
        isBusy: false,
        data: newData ? newData : this.allUsersAndTags
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
      <div className="browse-page">
        {
          this.state.redirectTo
            ? <Redirect to={ this.state.redirectTo } />
            : null
        }
        {
          this.state.isBusy
          ? <div className="search-page-loading-container">
              <LoadingBlocks/>
            </div>
          : <div className="search-page-container">
              <UserFilter
                search={false}
                giveConfig={this.getNormalFilterConfig}
                canClick={!!this.state.data}
                locationSearch={this.props.location.search}
                appSavedPrevSearch={this.props.prevBrowse}
              />
              <UserSort
                giveConfig={this.getSortConfig}
                canClick={!!this.state.data}
                locationSearch={this.props.location.search}
                appSavedPrevSearch={this.props.prevBrowse}
              />
              {
                this.state.data && this.state.data.length
                  ? <UserCards
                      data={this.state.data}
                    />
                  : null
              }
            </div>
        }
      </div>
    )
  }
}

export default Browse
