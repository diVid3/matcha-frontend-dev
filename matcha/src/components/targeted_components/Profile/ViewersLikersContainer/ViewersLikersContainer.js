import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class ViewersLikersContainer extends Component {
  render() {
    return (
      <div className="viewers-likers-container">
        {
          this.props.displayViewers
            ? this.props.content.map(
                item => <div className="viewers-likers-viewer" key={item.id}>
                  <p className="viewers-likers-viewer-text">{`${ item.viewer_username } has viewed your profile`}</p>
                </div>
              )
            : this.props.content.map(
                item => <div className="viewers-likers-liker" key={item.id}>
                  <p className="viewers-likers-liker-text">{`${ item.liker_username } has viewed your profile`}</p>
                </div>
              )
        }
      </div>
    )
  }
}

ViewersLikersContainer.propTypes = {
  displayViewers: PropTypes.bool,
  content: PropTypes.array
}

export default ViewersLikersContainer
