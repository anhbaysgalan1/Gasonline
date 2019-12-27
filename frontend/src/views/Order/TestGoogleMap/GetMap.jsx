import { Row, Col, Form, FormGroup, CardHeader,	CardFooter, CardBody, Card, Button, Label, Input } from 'reactstrap';
import {renderTextField, renderDropdown, Validate, Normalize, renderCheckboxField} from '@/helpers/Form'
import React, {Component} from 'react'
import {Translate, Localize, I18n} from 'react-redux-i18n'
import {Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Field, reduxForm, change} from 'redux-form'
import ReactGoogleMap from '@/components/GoogleMap/ReactGoogleMap';
import usersActions from '@/actions/usersActions';
import rolesActions from '@/actions/rolesActions';
import groupsActions from '@/actions/groupsActions';
import Preview from './preview'
import { SS } from '@/global'
import _ from 'lodash'

class EditForm extends Component {
	constructor() {
		super()
		this.state = {
			value: [ 'orange', 'red' ],
			groupOption: {
				disabled: false
			},
      userEdit: null,
			center: undefined,
		}
		this.ref = {}
	}

  componentWillReceiveProps(nextProps) {
    //xử lý khi thay đổi input lat,long thì tự động thay đổi bản đồ
		if(nextProps.previewEdit && nextProps.previewEdit.edit.form.values){
			let {latitude, longitude} = _.get(nextProps, 'previewEdit.edit.form.values',{})
			let oldLat = _.get(this.props,'previewEdit.edit.form.values.latitude')
			let oldLng = _.get(this.props,'previewEdit.edit.form.values.longitude')
			if(this.ref.map && (latitude != oldLat || longitude != oldLng)){
				this.ref.map.setCenter({
					lat: parseFloat(latitude),
					lng: parseFloat(longitude)
				})
			}
		}
	}

	handleLoadMap(refMap) {
		this.ref.map = refMap;
	}

  handleCenterChanged() {

	}

	setCenterToInput(){
		let centerPosition = this.ref.map.getCenter()
    this.onChange('latitude', centerPosition.lat())
  	this.onChange('longitude', centerPosition.lng())
	}


	onChange(field, value) {
		this.props.onChange(field, value)
	}

  onZoomChanged(){
    this.onChange('zoom_size', this.ref.map.getZoom())
  }

  renderMap(position) {
    let data = this.props.previewEdit && this.props.previewEdit.edit ? this.props.previewEdit.edit.form.values : null
    let {center} = this.state
    if (center !== undefined) {
      position = center
    }
    if (data) {
      return (
			<div style={window.innerWidth < 576 ? {height: '230px'} : {height: '100%'}}>
				<ReactGoogleMap 
					showCenter
					zoom={data.zoom_size}
					onZoomChanged={() => this.onZoomChanged()}
					onloadMap={(refMap) => this.handleLoadMap(refMap)}
					defaultCenter={position}
					onSearchPlace={() => this.handleCenterChanged()}
				/>
			</div>
			)
    }
  }

	render() {
    const position = { 
      lat: 20.222222, 
      lng: 135.5656656
    } 
		return (
      <div>
        {position ? this.renderMap(position) : ''}
			</div>)
	}
}

EditForm = reduxForm({form: 'user.edit.form'})(EditForm)
const mapStateToProps = state => {
	return {
		initialValues: state.users.data,
		roles: state.roles,
		groups: state.groups,
		previewEdit: state.form.user
	}
}

const mapDispatchToProps = (dispatch, props) => {
	return {
		onLoadRole: (params) => {
			dispatch(rolesActions.actFetchAll(params))
		},
		onLoadGroup: (params) => {
			dispatch(groupsActions.actFetchAll(params))
		},
		onChange: (field, value) => {
			dispatch(change('user.edit.form', field, value))
		},
		onLoad: (params) => {
			dispatch(usersActions.actFetch(params))
		},
		onSave: (params) => {
			dispatch(usersActions.actEdit(params))
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditForm));
