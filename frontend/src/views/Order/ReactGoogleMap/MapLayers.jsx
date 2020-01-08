import React, {Component} from 'react'
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps"
import {compose, withProps} from "recompose"
import SearchBox from "react-google-maps/lib/components/places/SearchBox"
import {DateTimeField, TextField, Validation} from 'components/Forms'
import { Icon, Input } from '@material-ui/core'
import {I18n} from 'helpers/I18n'
import _ from 'lodash'

const google = window.google = window.google ? window.google : {}

const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

class MapLayers extends Component {
	constructor(props) {
		super(props)
		this.state = {
			deliveryAddress: "",
			reload: false,
		}
		this.ref 	 = { map: null, markerCenter: null, searchBox: null }
		this.state = { options: {}, zoom: null, bounds: null, canter: {} }
		this.centerPosition = null
		this.bounds = null
		this.validate = {
      required: [
        Validation.required(I18n.t("Validate.required.base"))
      ]
    }
	}
	componentDidMount() {
		this.generateOptions(this.props.options)
	}
	componentWillReceiveProps(nextProps) {
		this.generateOptions(nextProps.options)
	}
	renderMarkerCenter() {
		let center = this.getCenterPosition()
		if(_.get(center, 'lat', '') && (_.get(center, 'lat', '')))
			return <Marker position={center} /> // position={{lat: 20.994009, lng: 105.802667}}
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
		let centerServer = {
			lat: Number(_.get(this.props, 'order.mapAddress.latitude', '')),
			lng: Number(_.get(this.props, 'order.mapAddress.longitude', ''))
		}
		return this.centerPosition || centerServer
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
		let defauCenter = { 
			lat: Number(_.get(this.props, 'order.mapAddress.latitude', '')), 
			lng: Number(_.get(this.props, 'order.mapAddress.longitude', '') )
		}
		let zoom = 14
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
		if(!places) return 
		let deliveryAddress = ""
		let lat = ""
		let lng = ""
		if(places.length){
			deliveryAddress = _.get(places[0], 'formatted_address', '') //formatted_address, name
		}
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
			lat = _.get(nextCenter.toJSON(), 'lat', '')
			lng = _.get(nextCenter.toJSON(), 'lng', '')
      nextCenter = nextCenter.toJSON()
		}
		this.setState({ deliveryAddress: deliveryAddress, reload: !this.state.reload })
		this.props.getDeliveryAddress({deliveryAddress: deliveryAddress, lat: lat, lng: lng })
		this.handleMapCenterChanged(nextCenter)
		let options = this.state.options
		options.center = nextCenter
		this.setState({ options: Object.assign({}, options), zoom: 15, },() =>{
			options.onZoomChanged()
      if(this.props.onSearchPlace) this.props.onSearchPlace()
    })
	}

	onChangeInput = (value) => {
		this.props.onChangeAddress(value)
	}

	mouseInAddress = () => {
		this.props.getMouseInOutAddress(false)
	}

	mouseOutAddress = () => {
		this.props.getMouseInOutAddress(true)
	}

	render() {
		let options = this.getOptions()
		let { orderDetail } = this.props
		let deliveryAddress = _.get(this.props, 'order.deliveryAddress', '')
		return ( 
			<GoogleMap {...options} ref={(ref) => { this.setRefMap(ref) }} >
				{this.renderMarkerCenter()}
				{
					orderDetail ? "" 
					:	<SearchBox
							controlPosition={google.maps.ControlPosition.LEFT_TOP}
							bounds = {this.bounds}
							onPlacesChanged={() => this.onPlacesChanged()}
							ref={(ref) => { this.ref.searchBox = ref }}
						>
							<TextField
								fullWidth
								validate={this.validate.required}
								name="deliveryAddress"
								onMouseMove={this.mouseInAddress}
								onMouseOut={this.mouseOutAddress}
								defaultValue={this.state.deliveryAddress || deliveryAddress}
								onChange={this.onChangeInput}
								label={I18n.t(`Input.order.deliveryAddress`)}
								placeholder=""
								style={{
									position: 'absolute',
									boxSizing: `groove-box`,
									border: `1px groove transparent`,
									width: `110%`,
									height: `70px`,
									marginTop: "0px",
									zIndex: 1,
									backgroundColor: 'white',
									padding: `0 12px 12px 12px`,
									borderRadius: `3px`,
									boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
									fontSize: `14px`,
									outline: `none`,
									textOverflow: `ellipses`,
									marginBottom: "20px",
								}}
							/>
						</SearchBox>
				}
					
			</GoogleMap>
		)
	}
}

export default compose(withProps({
  googleMapURL: "https://maps.google.com/maps/api/js?key=AIzaSyAgOuZWde1UFUOIunPgFFabrbsjPhKxTF0&libraries&v=3.exp&libraries=geometry,drawing,places",
  loadingElement: <div style={{height: '400px'}}/>,
  containerElement: <div style={{height: '400px', width: '100%'}}/>,
  mapElement: <div style={{height: '400px'}}/>
}), withScriptjs, withGoogleMap)(MapLayers)
