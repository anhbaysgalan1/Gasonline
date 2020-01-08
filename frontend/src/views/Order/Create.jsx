import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import {Button, Grid, Icon} from '@material-ui/core'
import PaperFade from 'components/Main/PaperFade'
import {Form} from 'components/Forms'
import {BaseView} from 'views/BaseView'
import MainForm from './components/MainForm'
import FuelsForm from './components/FuelsForm'
import {I18n} from 'helpers/I18n'

const styles = theme => ({
  button: {
    marginLeft: '5px'
  },
  sizeIcon: {
    fontSize: '15px'
  }
})

class Create extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      checkExist: true,
      reload: false,
      paths: [],
      statusMouse: true,
      
    }
    this.refMap = null
    this.refCirle = {}
    this.onSubmit = this.onSubmit.bind(this)
  }

  back = () => {
    this.goto('/orders')
  }

  // Check Chuật trong Input Address tránh nhận Enter khi nhập xong địa chỉ
  getMouseInOutAddress = (statusMouse) => {
    this.setState({ statusMouse: statusMouse, reload: !this.state.reload })
  }

  onSubmit(value) {
    console.log('onSubmit ', value)
    let lat = this.getData(value, 'lat', '')
    let lng = this.getData(value, 'lng', '')
    if(lng && lat){
      this.props.onSubmit(value)
      this.setState({ checkExist: true, reload: !this.state.reload })
    } else {
      this.setState({ checkExist: false , reload: !this.state.reload })
    }
  }

  render() {
    const {classes, customers, areas} = this.props
    return (
      <PaperFade style={{ height: 'auto', width: '100%' }} >
        <Form className={classes.form} onSubmit={this.onSubmit} > 
        {/* onSubmit={onSubmit} */}
          <Grid container>
            <Grid item xs={12} lg={3}>
              <FuelsForm typeNum="quantity" title={I18n.t("Label.order.quantity")} />
            </Grid>
            <Grid item xs={12} lg={9}>
              <MainForm 
                checkExist={this.state.checkExist} 
                customers={customers} 
                areas={areas}
                getMouseInOutAddress={this.getMouseInOutAddress}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={this.back}>
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
              </Button>
              <Button 
                size='small' variant="contained" color="primary" 
                type= {this.state.statusMouse == true ? "submit" : 'button'} 
                className={classes.button}
              >
                {I18n.t("Button.create")}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Create));
