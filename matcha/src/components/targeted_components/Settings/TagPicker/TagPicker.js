import React, { Component } from 'react'

import PropTypes from 'prop-types';

export class TagPicker extends Component {
  constructor(props) {
    super()

    // This only gets created once.
    this.canClickStates = [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]

    // This only gets created once.
    this.tagIndex = -1
  }

  // canClickStates are used to throttle the clicking of the tags.

  render() {
    return (
      <div className="settings-page-tags-container">
        <p className="settings-page-input-container-heading settings-page-input-container-heading-tags">
          Pick your tags
        </p>
        {
          // mapping out default tag set.
          this.props.pickableTags.map(
            tag => {
              let colorIn = false

              // Checking the intersection of default tags and chosen user tags, coloring if in intersection.
              this.props.tags.forEach((userTag) => {
                if (userTag.tag === tag.tag) {
                  colorIn = true
                }
              })

              // What wizzardy is this???
              // JK, this is done to reset the tagIndex since it's only mounted once.
              if (this.tagIndex >= 10) {
                this.tagIndex = 0
              }

              // This is to give the onClick handlers the indices to the click states.
              if (this.tagIndex < 11) {
                this.tagIndex++
              }

              return <div
                className={
                `settings-page-pickableTags-tag ${
                  colorIn
                    ? 'settings-page-pickableTags-tag-chosen'
                    : ''
                }`
              }
              key={tag.id}

              // Passing through the default tag so it can be checked against the set of chosen user tags.
              onClick={this.props.myOnClick(tag, this.canClickStates, this.tagIndex)}
              >
                {tag.tag}
              </div>
            }
          )
        }
      </div>
    )
  }
}

TagPicker.propTypes = {
  tags: PropTypes.array,
  pickableTags: PropTypes.array,
  myOnClick: PropTypes.func
};

export default TagPicker
