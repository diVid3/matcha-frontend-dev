import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Config from '../../../config/Config'
import CircleMarker from './CircleMarker'
 
class SimpleMap extends Component {

  static defaultProps = {
    zoom: 13
  };
 
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '150px', width: '100%', zIndex: '0' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: Config.mapKey }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <CircleMarker
            lat={this.props.center.lat}
            lng={this.props.center.lng}
          />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default SimpleMap;