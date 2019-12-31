import React, {Component} from 'react'
import { GoogleMap, Marker, withGoogleMap, withScriptjs, InfoWindow } from "react-google-maps"
import {MarkerWithLabel} from "react-google-maps/lib/components/addons/MarkerWithLabel"
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer"
import { compose, withProps } from "recompose"
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
import { Icon } from '@material-ui/core' 
import _ from 'lodash'

const google = window.google = window.google ? window.google : {}


class MapLayers extends Component {
	constructor(props) {
		super(props)
		this.ref 	 = { map: null, markerCenter: null, searchBox: null }
		this.state = { options: {}, zoom: null, bounds: null, canter: {}, open: true }
		this.centerPosition = null
		this.bounds = null
	}

	onToggleOpen = () => {
		this.setState({ open: !this.state.open})
	}

	componentDidMount() {
		this.generateOptions(this.props.options)
	}

	componentWillReceiveProps(nextProps) {
		this.generateOptions(nextProps.options)
	}

	renderMarkerCenter() {
		let centerPosition = this.getCenterPosition()
		return (
			<Marker position={centerPosition} onClick={this.onToggleOpen} >
				{
					this.state.open && 
					<InfoWindow style={{ display: 'none' }} disableAutoPan={false} >
						<div style={{ padding: '0px', color: 'red'}}>1</div>
					</InfoWindow>
				}
			</Marker>
		)
		// centerPosition {lat: 21.00341, lng: 105.814973}
		// return <Marker position={ centerPosition || { lat: 20.994009, lng: 105.802667 }  } />
	}
	
	setRefMap(ref) { //gán function vào ref để có thẻ gọi được từ bên ngoài
		if(ref){
			ref.setCenter = (center, ifNotExist) => this.setCenter(center, ifNotExist, true)
		}
		this.ref.map = ref
		if (typeof this.props.options.onloadMap == "function") {
			this.props.options.onloadMap(ref)
		}
	}
	setZoom(zoom, ifNotExist = false){
		if(ifNotExist){
			if(this.state.zoom == null){
				this.setState({zoom: zoom})
			}
		} else {
			this.setState({zoom: zoom})
		}
	}

	setCenter(center, ifNotExist = false, forceRender = false){
		let lat = _.get(center, 'lat', '')
		let lng = _.get(center, 'lng', '')
		let changedCenter = false
		if(typeof lat == "function"){
      center = center.toJSON();
    }
		if(!isNaN(lat) && !isNaN(lng)){
      lat = parseFloat(lat)
      lng = parseFloat(lng)
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
				this.setState({
					renderView: !this.state.renderView
				})
			}
		}
	}
	
	getCenterPosition(){
		return this.centerPosition || { lat: 21.003410, lng: 105.814973 }
	}
	getZoom(){
		return parseInt(this.state.zoom) > 1 ?  this.state.zoom || 15 : 1;
	}
	getOptions() {
		let options = this.state.options
		options['center'] = this.getCenterPosition()
		options['zoom'] = options.zoom || this.getZoom()
		return options
	}
	generateOptions(options) {
		options = Object.assign({}, options)
		options.onCenterChanged = () => this.handleMapCenterChanged()
		options.onZoomChanged   = () => this.handleMapZoomChanged()
		options.onBoundsChanged = () => this.handleBoundsChanged()
		options = { 
			...options,
			options: {
        mapTypeControl		: false, // Chọn loại bản dồ
        streetViewControl	: false, // Đường phố
        navigationControl	: false, // Dẫn đường
        mapTypeId					: google.maps.MapTypeId.TERRAIN,
				zoomControlOptions				: { position: google.maps.ControlPosition.LEFT_CENTER },
				fullscreenControlOptions	: { position: google.maps.ControlPosition.LEFT_CENTER },
			}
		}
		this.setState({ options: options })
		let defauCenter = { lat: 21.003410, lng: 105.814973 }
		let zoom = 11
		this.setCenter(defauCenter, true)
		this.setZoom(zoom)
	}

	handleMapCenterChanged(position) {
		let lat = _.get(position, 'lat', '')
		let lng = _.get(position, 'lng', '')
		if(lat && lng) {
			this.setState({ center: { lat: lat, lng: lng } })
		}
		if(!_.isEmpty(position)){
			this.setCenter(position )
		} else {
			this.setCenter(this.state.center )
		}
		let {onCenterChanged} = this.props.options
		if (typeof onCenterChanged == "function") {
      onCenterChanged()
		}
	}
	handleMapZoomChanged(){
    this.setState({ zoom: this.ref.map.getZoom()})
    let {onZoomChanged} = this.props.options
    if (typeof onZoomChanged == "function")
      onZoomChanged()
	}
	handleBoundsChanged(){
		this.bounds = this.ref.map.getBounds()
	}

  onPlacesChanged() {
		const places = this.ref.searchBox.getPlaces()
		const bounds = new google.maps.LatLngBounds()
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
		this.setState({ options: Object.assign({}, options), zoom: 15, },() =>{
			options.onZoomChanged()
      if(this.props.onSearchPlace) this.props.onSearchPlace()
    })
	}

	render() {
		let options = this.getOptions()
		return (
			<GoogleMap {...options} ref={(ref) => { this.setRefMap(ref) }} >
				{this.renderMarkerCenter()}
				{/* {this.props.children} */}
				<SearchBox
					controlPosition={google.maps.ControlPosition.LEFT_TOP}
					bounds = {this.bounds}
					onChange={this.onChangeInput}
					onPlacesChanged={() => this.onPlacesChanged()}
					ref={(ref) => { this.ref.searchBox = ref }}
				>
				<input
					type="text"
					placeholder="Search Google Maps"
					style={{
						boxSizing: `border-box`,
						border: `1px solid transparent`,
						width: `200px`,
						height: `30px`,
						marginTop: 10,
						marginLeft: 10,
						padding: `0 12px`,
						borderRadius: `1px`,
						boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
						fontSize: `12px`,
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
  googleMapURL: "https://maps.google.com/maps/api/js?key=AIzaSyAgOuZWde1UFUOIunPgFFabrbsjPhKxTF0&libraries&v=3.exp&libraries=geometry,drawing,places",
  loadingElement: <div style={{height: '100%'}}/>,
  containerElement: <div style={{height: '100%', width: '100%'}}/>,
  mapElement: <div style={{height: '250px'}}/>
}), withScriptjs, withGoogleMap)(MapLayers)
