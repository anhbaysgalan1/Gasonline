import React, {Component} from 'react'
import { Marker, InfoWindow } from "react-google-maps"
import {Link} from 'react-router-dom';
import {Polyline, Circle} from "react-google-maps"
import moment from "moment"
import _ from 'lodash'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import {Button, Grid, Icon} from '@material-ui/core'
import PaperFade from 'components/Main/PaperFade'
import {Form} from 'components/Forms'
import {BaseView} from 'views/BaseView'
import {I18n} from 'helpers/I18n'
import MapLayers from './MapLayers'

const styles = theme => ({ })

class GetMap extends BaseView {
	constructor(props) {
		super(props)
	}
	
  render() {
		let onSearchPlace = this.props.onSearchPlace || (() =>{})
		let { getDeliveryAddress, deliveryAddress, onChangeAddress, order, orderDetail, getMouseInOutAddress } = this.props
		return (
			<MapLayers 
				order={order}
				orderDetail={orderDetail}
				onChangeAddress={onChangeAddress}
				deliveryAddress={deliveryAddress}
				getDeliveryAddress={getDeliveryAddress}
				options={{ ...this.props }}
				getMouseInOutAddress={getMouseInOutAddress}
				onSearchPlace={() => onSearchPlace()}
			>
			</MapLayers>
		)
  }
}

GetMap.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(GetMap))
