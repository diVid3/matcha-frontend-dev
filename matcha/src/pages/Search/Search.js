import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import UsersProvider from '../../providers/UsersProvider'
import PromiseCancel from '../../helpers/PromiseCancel'
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import UserSortAndFilter from '../../helpers/UserSortAndFilter'
import UserFilter from '../../components/shared_components/UserFilter/UserFilter'

import './Search.css'

export class Search extends Component {
  constructor(props) {
    super()

    this.state = {
      isBusy: false,
      redirectTo: ''
    }

    this.pendingPromises = []
    this.ownInfo = null
    this.allUsersAndTags = null

    this.filterThis = this.filterThis.bind(this)
  }

  filterThis(queryParam) {

    // TODO: This does not cause the component to remount as was initially thought, but it still causes
    // a store to the history api, which is good, so if this method is called, the query param can be stored
    // in the App component to enable detection of custom user input into the URL bar and not act on it.
    //
    // So a setState is required to affect the history api, but a manual search should be kicked off here...
    //
    // You need to also manually run the code that is currently in componentDidMount().
    this.setState({
      redirectTo: '/search' + queryParam
    })
  }

  componentDidMount() {

    // TODO: Only pre-load / fetch data + filter + sort if (this.props.location.search) is true
    // otherwise, fetch + filter data as 'Search' + present another filter + sort when the user
    // clicks on search.

    if (this.props.location.search) {

      this.setState({
        isBusy: true
      })

      const cancelableGetOwnInfoPromise = PromiseCancel.makeCancelable(
        UsersProvider.getSessionUsername()
      )
  
      const cancelableGetAllUsersAndTagsPromise = PromiseCancel.makeCancelable(
        UsersProvider.getAllUsersAndTags()
      )
  
      this.pendingPromises.push(cancelableGetOwnInfoPromise)
      this.pendingPromises.push(cancelableGetAllUsersAndTagsPromise)
  
      Promise.all([
        cancelableGetOwnInfoPromise.promise,
        cancelableGetAllUsersAndTagsPromise.promise
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
  
        console.log(this.allUsersAndTags)
        this.allUsersAndTags = UserSortAndFilter.filterData(this.props.location.search, this.ownInfo, this.allUsersAndTags)
        UserSortAndFilter.sortData(this.props.location.search, this.ownInfo, this.allUsersAndTags)
        console.log(this.allUsersAndTags)
  
        this.setState({
          isBusy: false
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
  }

  componentWillUnmount() {

    this.pendingPromises.forEach(p => p.cancel())
  }

  render() {
    return (
      <div className="search-page">
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
                search={true}
                filterThis={this.filterThis}
              />
            </div>
        }
      </div>
    )
  }
}

export default Search
