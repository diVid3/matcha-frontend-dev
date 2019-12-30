import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import UsersProvider from '../../providers/UsersProvider'
import PromiseCancel from '../../helpers/PromiseCancel'
import LoadingBlocks from '../../components/shared_components/LoadingBlocks/LoadingBlocks'
import UserFilter from '../../helpers/UserFilter'
import ParseFilterSortParam from '../../helpers/ParseFilterSortParam'

import './Search.css'

export class Search extends Component {
  constructor(props) {
    super()

    this.state = {
      isBusy: true,
      redirectTo: ''
    }

    this.pendingPromises = []
    this.ownInfo = null
    this.allUsersAndTags = null
  }

  componentDidMount() {

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

      this.ownInfo = json[0]
      this.allUsersAndTags = json[1].rows.filter((user) => user.username !== this.ownInfo.username)

      console.log(UserFilter.flattenUsersAndTags(this.allUsersAndTags))

      // TODO: Need to add the 'matcha' default tag to the system otherwise the DB left joing is going to
      // complicate things...

      if (this.props.location.search) {

        ParseFilterSortParam.getFilterConfig(this.props.location.search)
      }

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

            </div>
        }
      </div>
    )
  }
}

export default Search
