import React, { Component } from 'react'

import './UserFilter.css'

const userFilterAcceptedTags = [
  'cats',
  'coffee',
  'gaming',
  'fishing',
  'hiking',
  'reading',
  'partying',
  'running',
  'stars',
  'science',
  'cooking'
]

export class UserFilter extends Component {
  constructor(props) {
    super()

    this.state = {
      tagClickStates: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      furthestDistance: -1,   // Disabled, max 1000 km
      highestAge: 17,         // Disabled, max 99
      lowestRating: -1        // Disabled, max 1000
    }

    this.handleTagClickDecorator = this.handleTagClickDecorator.bind(this)
    this.handleDistanceChange = this.handleDistanceChange.bind(this)
    this.handleAgeChange = this.handleAgeChange.bind(this)
    this.handleRatingChange = this.handleRatingChange.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  handleButtonClick(e) {

    if (
      this.state.furthestDistance <= -1 &&
      this.state.highestAge <= 17 &&
      this.state.lowestRating <= -1 &&
      this.state.tagClickStates.every((tag) => !tag)
    ) {

      return
    }

    let queryParam = '?'

    if (!(this.state.furthestDistance <= -1)) {

      queryParam += '&distance=' + this.state.furthestDistance
    }

    if (!(this.state.highestAge <= 17)) {

      queryParam += '&age=' + this.state.highestAge
    }

    if (!(this.state.lowestRating <= -1)) {

      queryParam += '&rating=' + this.state.lowestRating
    }

    if (!(this.state.tagClickStates.every((tag) => !tag))) {

      let tagStr = 'tags='

      this.state.tagClickStates.forEach((val, i) => {

        if (val) {

          tagStr += userFilterAcceptedTags[i] + '+'
        }
      })

      tagStr = tagStr.replace(/\+$/g, '')
      queryParam += tagStr
    }

    this.props.filterThis(queryParam)
  }

  handleDistanceChange(e) {
    const { value } = e.target

    this.setState({
      furthestDistance: value
    })
  }

  handleAgeChange(e) {
    const { value } = e.target

    this.setState({
      highestAge: value
    })
  }

  handleRatingChange(e) {
    const { value } = e.target

    this.setState({
      lowestRating: value
    })
  }

  handleTagClickDecorator(i) {

    return (e) => {

      const newTagClickStates = this.state.tagClickStates.slice()
      newTagClickStates[i] = !this.state.tagClickStates[i]

      this.setState({
        tagClickStates: newTagClickStates
      })
    }
  }

  render() {
    return (
      <div className="user-filter">
        <div className="user-filter-flex-container">
          <div className="user-filter-sliders-container">
            <div className={`user-filter-slider-container ${
              this.state.furthestDistance <= -1
                ? 'user-filter-slider-container-disabled'
                : ''
            }`}>
            <div className="user-filter-slider-container-heading-container">
              <p className="user-filter-slider-container-heading">
                Furthest distance
              </p>
              {
                this.state.furthestDistance <= -1
                  ? null
                  : <p className="user-filter-slider-container-value">
                      { this.state.furthestDistance }
                    </p>
              }
            </div>
              <input
                className="user-filter-slider"
                type="range"
                min="-1" max="1000"
                value={this.state.furthestDistance}
                onChange={this.handleDistanceChange}
                step="1"
              />
            </div>
            <div className={`user-filter-slider-container ${
              this.state.highestAge <= 17
                ? 'user-filter-slider-container-disabled'
                : ''
            }`}>
            <div className="user-filter-slider-container-heading-container">
              <p className="user-filter-slider-container-heading">
                Highest age
              </p>
              {
                this.state.highestAge <= 17
                  ? null
                  : <p className="user-filter-slider-container-value">
                      { this.state.highestAge }
                    </p>
              }
            </div>
              <input
                className="user-filter-slider"
                type="range"
                min="17" max="99"
                value={this.state.highestAge}
                onChange={this.handleAgeChange}
                step="1"
              />
            </div>
            <div className={`user-filter-slider-container ${
              this.state.lowestRating <= -1
                ? 'user-filter-slider-container-disabled'
                : ''
            }`}>
              <div className="user-filter-slider-container-heading-container">
                <p className="user-filter-slider-container-heading">
                  Lowest rating
                </p>
                {
                  this.state.lowestRating <= -1
                    ? null
                    : <p className="user-filter-slider-container-value">
                        { this.state.lowestRating }
                      </p>
                }
              </div>
              <input
                className="user-filter-slider"
                type="range"
                min="-1" max="1000"
                value={this.state.lowestRating}
                onChange={this.handleRatingChange}
                step="1"
              />
            </div>
          </div>
          <div className={`user-filter-tag-picker ${
            this.state.tagClickStates.some((clickState) => !!clickState)
              ? ''
              : 'user-filter-tag-picker-disabled'
          }`}>
            <p className="user-filter-tag-picker-heading">
              Should have these tags
            </p>
            <div className="user-filter-tag-picker-tags-container">
              {
                userFilterAcceptedTags.map((tag, i) =>
                  <div
                    key={i}
                    className={`user-filter-tag-picker-tag ${
                      this.state.tagClickStates[i]
                        ? 'user-filter-tag-picker-tag-chosen'
                        : ''
                    }`}
                    onClick={this.handleTagClickDecorator(i)}
                  >
                    { tag }
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="user-filter-button-container">
          <button
            className="user-filter-button"
            type="button"
            onClick={this.handleButtonClick}
          >
            {
              this.props.search
                ? 'Search'
                : 'Filter'
            }
          </button>
        </div>
      </div>
    )
  }
}

export default UserFilter
