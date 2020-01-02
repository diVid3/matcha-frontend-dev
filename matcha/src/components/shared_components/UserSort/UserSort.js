import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ParseFilterSortParam from '../../../helpers/ParseFilterSortParam'

import './UserSort.css'

export class UserSort extends Component {
  constructor(props) {
    super()

    this.state = {
      currentActiveButtonString: ''
    }

    this.handleButtonClickDecorator = this.handleButtonClickDecorator.bind(this)
  }

  handleButtonClickDecorator(sortType) {

    return (e) => {

      if (!this.props.canClick) {

        return
      }

      this.setState({
        currentActiveButtonString: sortType
      })

      if (sortType === 'age') {

        this.props.giveConfig('&sort=age')
      }

      if (sortType === 'distance') {

        this.props.giveConfig('&sort=distance')
      }

      if (sortType === 'rating') {

        this.props.giveConfig('&sort=rating')
      }

      if (sortType === 'tags') {

        this.props.giveConfig('&sort=tags')
      }
    }
  }

  componentDidMount() {

    if (
      this.props.locationSearch &&
      this.props.appSavedPrevSearch &&
      this.props.locationSearch === this.props.appSavedPrevSearch &&
      this.props.locationSearch.includes('sort')
    ) {

      const config = ParseFilterSortParam.getSortConfig(this.props.locationSearch)

      this.setState({
        currentActiveButtonString: config.sort
      })
    }
  }


  render() {
    return (
      <div className="user-sort">
        <div className="user-sort-button-container">
          <p className={`user-sort-button-container-heading ${
            !this.props.canClick
              ? 'user-sort-button-container-heading-disabled'
              : ''
          }`}>
            Sort by
          </p>
          <button
            className={`user-sort-button ${
              this.state.currentActiveButtonString === 'age'
                ? 'user-sort-button-selected'
                : ''
            } ${
              !this.props.canClick
                ? 'user-sort-button-disabled'
                : ''
            }`}
            type="button"
            onClick={this.handleButtonClickDecorator('age')}
          >
            Age
          </button>
          <button
            className={`user-sort-button ${
              this.state.currentActiveButtonString === 'distance'
                ? 'user-sort-button-selected'
                : ''
            } ${
              !this.props.canClick
                ? 'user-sort-button-disabled'
                : ''
            }`}
            type="button"
            onClick={this.handleButtonClickDecorator('distance')}
          >
            Distance
          </button>
          <button
            className={`user-sort-button ${
              this.state.currentActiveButtonString === 'rating'
                ? 'user-sort-button-selected'
                : ''
            } ${
              !this.props.canClick
                ? 'user-sort-button-disabled'
                : ''
            }`}
            type="button"
            onClick={this.handleButtonClickDecorator('rating')}
          >
            Rating
          </button>
          <button
            className={`user-sort-button ${
              this.state.currentActiveButtonString === 'tags'
                ? 'user-sort-button-selected'
                : ''
            } ${
              !this.props.canClick
                ? 'user-sort-button-disabled'
                : ''
            }`}
            type="button"
            onClick={this.handleButtonClickDecorator('tags')}
          >
            Tags
          </button>
        </div>
      </div>
    )
  }
}

UserSort.propTypes = {
  giveConfig: PropTypes.func.isRequired,
  canClick: PropTypes.bool,
  locationSearch: PropTypes.string.isRequired,
  appSavedPrevSearch: PropTypes.string.isRequired
}

export default UserSort
