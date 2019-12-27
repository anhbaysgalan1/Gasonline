import React, {Component} from 'react';
import {GoogleApiWrapper, Map} from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '350px'
};

export class MapContainer extends Component {
  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={14}
          style={mapStyles}
          initialCenter={{
            lat: 47.444,
            lng: -122.176
          }}
        />
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCKQJUBH906TKp_FsON26vW2t1zQuDHbPA'
})(MapContainer);
