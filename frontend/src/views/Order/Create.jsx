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
});

class Create extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      paths: []
    }
    this.refMap = null
    this.refCirle = {}
  }

  handleLoadMap(refMap) {
    this.refMap = refMap
    this.props.handleLoadMap(refMap)
  }

  back = () => {
    this.goto('/orders')
  }

  render() {
    const {classes, onSubmit, customers, areas} = this.props
    return (
      <PaperFade>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container>
            <Grid item xs={12} lg={3}>
              <FuelsForm
                typeNum="quantity"
                title={I18n.t("Label.order.quantity")}
              />
            </Grid>
            <Grid item xs={12} lg={9}>
              <MainForm customers={customers} areas={areas}/>
            </Grid>
          </Grid>

          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={this.back}>
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
              </Button>
              <Button size='small' type="submit" variant="contained" color="primary" className={classes.button}>
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
