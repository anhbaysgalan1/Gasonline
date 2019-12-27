import React, {Component} from 'react'
import GoogleMap from './GoogleMap'

class ReactGoogleMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			paths: []
		}
	}

	render() {
    let onSearchPlace = this.props.onSearchPlace || (() =>{})
		return (
			<GoogleMap options={{ ...this.props }} onSearchPlace={() => onSearchPlace()} >
				{this.props.children}
			</GoogleMap>
		);
	}
}

export default ReactGoogleMap;
