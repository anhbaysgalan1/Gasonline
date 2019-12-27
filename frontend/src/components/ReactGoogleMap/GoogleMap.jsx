import React, {Component} from 'react'
import {withScriptjs, withGoogleMap, GoogleMap, Marker, Polyline} from "react-google-maps"
import {compose, withProps} from "recompose"
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
import _ from 'lodash'

const google = window.google = window.google ? window.google : {}
class MapLayers extends Component {
	constructor() {
		super()
		this.ref = { map: null, markerCenter: null, searchBox: null }
		this.state = { options: {}, zoom: null, bounds: null }
		this.centerPosition = null
		this.bounds = null
  }

  componentDidMount() {
		this.generateOptions(this.props.options)
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.center){
			console.warn("sử dụng defaultCenter để set tọa độ ban đầu.")
		}
		this.generateOptions(nextProps.options)
	}

  setCenter(center, ifNotExist = false, forceRender = false){
		let changedCenter = false
		if(typeof center.lat == "function"){
      center = center.toJSON()
    }
		if(!isNaN(center.lat) && !isNaN(center.lng)){
      center.lat = parseFloat(center.lat)
      center.lng = parseFloat(center.lng)
			if(ifNotExist){
				if(this.centerPosition == null){
					this.centerPosition = center
					changedCenter = true
				}
			} else {
				this.centerPosition = center
				changedCenter = true
			}

			//kiểm tra nếu đang hiện marker ở tâm thì bắt buộc phải render lại view
			if(changedCenter && (this.props.options.showCenter || forceRender)){
				this.setState({ renderView: !this.state.renderView })
			}
		}
  }

  generateOptions(options) {
    options = Object.assign({}, options)
		//override method
		// options.onCenterChanged = () => this.handleMapCenterChanged()
		// options.onZoomChanged   = () => this.handleMapZoomChanged()
		// options.onBoundsChanged = () => this.handleBoundsChanged()

		options = { ...options,
			options:{ 
        mapTypeControl: false, streetViewControl: false, navigationControl: false,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        fullscreenControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER },
				zoomControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER }
			}
		}
		this.setState({options: options})
		let defaultCenter = this.props.options.defaultCenter || {
      lat: 20.994009, 
      lng: 105.802667,
		}
		this.setCenter(defaultCenter, true)
		this.setZoom(11, true)
  }

  setZoom(zoom, ifNotExist = false){
    this.setState({zoom: 11})
	}
  

  
	handleMapCenterChanged(position) {
    if (!position) {
      position = this.ref.map.getCenter()
    }
    this.setCenter(position)
    let {onCenterChanged} = this.props.options
    if (typeof onCenterChanged == "function")
      onCenterChanged()
  }

  getCenterPosition(){
		return { lat: 20.994009, lng: 105.802667 }
  }

  getZoom(){
		return 11
  }
  
	getOptions() {
		let options = this.state.options
		options['center'] = this.getCenterPosition()
		options['zoom'] = this.getZoom()
		return options
  }
  renderMarkerCenter() {
    let centerPosition = this.getCenterPosition()
    return (
      <Marker 
        position = {centerPosition} 
        ref = {(ref) => { this.ref.markerCenter = ref }} 
        // icon     = {{ url: iconPosition, scaledSize: { width: 50, height: 50 } }}
        imageSizes
      />
    )
  }
  renderMarkerUser() {
    return (
      <Marker position={{ lat: 20.994009, lng: 105.802667, }} />
    )
  }

  onPlacesChanged() {
    const places = this.ref.searchBox.getPlaces()
    const bounds = new google.maps.LatLng( -34.397, 150.644)
    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    })
    const nextMarkers = places.map(place => ({ position: place.geometry.location }))
    let nextCenter = _.get(nextMarkers, '0.position', this.getCenterPosition())
    if(typeof nextCenter.lat == "function"){
      nextCenter = nextCenter.toJSON()
    }
    this.handleMapCenterChanged(nextCenter)

		let options = this.state.options
		options.center = nextCenter
    this.setState({ options: Object.assign({}, options), zoom: 15 }, () => { 
        options.onZoomChanged() 
        if(this.props.onSearchPlace) this.props.onSearchPlace()
    })

  }
  
  render() {
		let options = this.getOptions()
		return (
        <GoogleMap {...options} > 
          {this.renderMarkerCenter()}
          {this.renderMarkerUser()}
          <SearchBox
            controlPosition={google.maps.ControlPosition.LEFT_TOP}
            bounds = {this.bounds}
            onPlacesChanged={() => this.onPlacesChanged()}
            ref={(ref) => { this.ref.searchBox = ref }}
          >
            <input
              type="text"
              placeholder="Search Google Maps"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `40px`,
                marginTop: 10,
                marginLeft: 10,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
              }}
            />
          </SearchBox>
        </GoogleMap>
    )
  }
}


export default compose(withProps({
	googleMapURL: "https://maps.google.com/maps/api/js?key=AIzaSyC7AoQK6nJCNzSi3QUWV8HeNRyUvwjMPxw&libraries&v=3.exp&libraries=geometry,drawing,places", 
	loadingElement: <div style={{ height: '100%' }}/>,
	containerElement: <div style={{ height: '100%', width: '100%' }}/>,
	mapElement: <div style={{ height: '100%' }}/>
}), withScriptjs, withGoogleMap)(MapLayers)
