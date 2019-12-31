import React, { Component } from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'
import {I18n} from 'helpers/I18n'
import _ from 'lodash'

const styles = theme => ({
})

const AnyReactComponent = ({ text }) => <div>{text}</div>

class Map extends Component {
  constructor(props){
      super(props)
      this.state = {
          position: {}
      }
  }

 
  render() {
    let latitudeIn  = Number(_.get(this.props, "latitudeIn", 35.4122))
    let longitudeIn = Number(_.get(this.props, "longitudeIn", 139.4130))
    let src = `https://maps.google.com/maps?q=${latitudeIn},${longitudeIn}&z=15&output=embed`
    return (
        <Card>
            <Typography variant="h5" component="h2">
                {I18n.t("Địa chỉ giao hàng")}
            </Typography>
                <iframe 
                    width="100%" 
                    height="320px" 
                    src={src}
                >
                </iframe>
                <p>{I18n.t('Input.latLong')}: {latitudeIn} - {longitudeIn}</p>
        </Card>
    )
}
}

export default Map