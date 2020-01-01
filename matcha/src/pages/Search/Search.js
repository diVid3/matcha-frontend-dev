import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import UsersProvider from '../../providers/UsersProvider'
import PromiseCancel from '../../helpers/PromiseCancel'
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import UserSortAndFilter from '../../helpers/UserSortAndFilter'
import UserFilter from '../../components/shared_components/UserFilter/UserFilter'
import UserSort from '../../components/shared_components/UserSort/UserSort'

// It's important to setState({ data }) so that the components required to project the data will
// detect the state change. This must be done after this.allUsersAndTags is mutated and ready for
// displaying.

import './Search.css'

export class Search extends Component {
  constructor(props) {
    super()

    this.state = {
      isBusy: false,
      redirectTo: '',
      data: null
    }

    this.pendingPromises = []
    this.ownInfo = null
    this.allUsersAndTags = null

    this.getSearchConfig = this.getSearchConfig.bind(this)
    this.getNormalFilterConfig = this.getNormalFilterConfig.bind(this)
    this.getSortConfig = this.getSortConfig.bind(this)
  }

  // TODO: Sorting can't be done without data, by the time you have data, the URL already contains a '?',
  // so you can simply push the current search param + the sort string to the history api, then sort,
  // then setState({ data: this.allUsersAndTags }).
  getSortConfig(queryParam) {

    console.log(this.state.data)

    this.props.history.push('/search' + this.props.location.search + queryParam)
    this.props.savePrevSearch(this.props.location.search + queryParam)

    UserSortAndFilter.sortData(this.props.location.search, this.ownInfo, this.allUsersAndTags)

    this.setState({
      data: this.allUsersAndTags
    }, () => {
      console.log(this.state.data)
    })
  }

  // TODO: Since /Search has essentially 2 filters, this won't affect the query params, however,
  // /Search has only 1 sort, so sort should take the current query params, if any, and attach
  // the sort config to it, then remember that componentDidMount did mount should do the search first
  // then the sort.
  getNormalFilterConfig(queryParam) {

    // console.log(queryParam)

    // TODO: This should simply filter the data again, stupid I know, and then just do a setState
    // of the new data.

    const newData = UserSortAndFilter.filterData(queryParam, this.ownInfo, this.allUsersAndTags)

    this.setState({
      data: newData
    }, () => {

      console.log(this.state.data)
    })
  }

  getSearchConfig(queryParam) {

    // A search is done to actually get the data for the 2nd filter and sort components.

    this.props.history.push('/search' + queryParam)
    this.props.savePrevSearch(queryParam)

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
      this.allUsersAndTags = UserSortAndFilter.filterData(this.props.location.search, this.ownInfo, this.allUsersAndTags)

      // TODO: Use this here after getting sort config
      // UserSortAndFilter.sortData(this.props.location.search, this.ownInfo, this.allUsersAndTags)

      this.setState({
        isBusy: false,
        data: this.allUsersAndTags
      })

      console.log(this.state.data)
    })
    .catch((json) => {

      sessionStorage.setItem('viewError', '1')
  
      this.setState({
        isBusy: false,
        redirectTo: '/oops'
      })
    })
  }

  componentDidMount() {

    console.log('Search mounted!')

    // TODO: Only pre-load / fetch data + filter + sort if (this.props.location.search) is true
    // otherwise, fetch + filter data as 'Search' + present another filter + sort when the user
    // clicks on search.

    if (
      this.props.location.search &&
      this.props.prevSearch &&
      this.props.location.search === this.props.prevSearch
    ) {

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
        this.allUsersAndTags = UserSortAndFilter.filterData(this.props.location.search, this.ownInfo, this.allUsersAndTags)

        // TODO: Use this here after getting sort config, might need to test with .includes('sort')
        // UserSortAndFilter.sortData(this.props.location.search, this.ownInfo, this.allUsersAndTags)

        this.setState({
          isBusy: false,
          data: this.allUsersAndTags
        })

        console.log(this.state.data)
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
                giveConfig={this.getSearchConfig}
                canClick={true}
                locationSearch={this.props.location.search}
                appSavedPrevSearch={this.props.prevSearch}
              />
              <UserFilter
                search={false}
                giveConfig={this.getNormalFilterConfig}
                canClick={!!this.state.data}
                locationSearch={''}
                appSavedPrevSearch={''}
              />
              <UserSort
                giveConfig={this.getSortConfig}
                canClick={!!this.state.data}
                locationSearch={this.props.location.search}
                appSavedPrevSearch={this.props.prevSearch}
              />
            </div>
        }
      </div>
    )
  }
}

export default Search
