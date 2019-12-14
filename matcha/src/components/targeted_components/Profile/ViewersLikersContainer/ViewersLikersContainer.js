import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoadingBlocks from '../../../shared_components/LoadingBlocks/LoadingBlocks'

import './ViewersLikersContainer.css'

export class ViewersLikersContainer extends Component {
  render() {
    return (
      <div className="viewers-likers-container">
        {
          this.props.isLoading
            ? <div className="viewers-likers-loading-container">
                <LoadingBlocks />
              </div>
            : null
        }
        {
          !this.props.isLoading
            ? this.props.displayViewers
              ? this.props.content.length
                ? this.props.content.reverse().map(
                    item => <div className="viewers-likers-viewer" key={item.id}>
                      <p className="viewers-likers-viewer-text">
                        {`${ item.viewer_username } `}
                      </p>
                    </div>
                  )
                : <p className="viewers-likers-content-empty-text">No viewers</p>
              : this.props.content.length
                ? this.props.content.reverse().map(
                    item => <div className="viewers-likers-liker" key={item.id}>
                      <p className="viewers-likers-liker-text">
                        {`${ item.liker_username } `}
                      </p>
                    </div>
                  )
                : <p className="viewers-likers-content-empty-text">No likers</p>
            : null
        }
      </div>
    )
  }
}

ViewersLikersContainer.propTypes = {
  displayViewers: PropTypes.bool,
  content: PropTypes.array,
  isLoading: PropTypes.bool
}

export default ViewersLikersContainer
