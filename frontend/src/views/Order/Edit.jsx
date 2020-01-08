import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {BaseView} from 'views/BaseView';
import {Form} from 'components/Forms'
import MainForm from './components/MainForm';
import FuelsForm from './components/FuelsForm';
import {Button, Chip, Grid, Icon, Typography} from '@material-ui/core';
import PaperFade from 'components/Main/PaperFade';
import {I18n} from 'helpers/I18n';

const styles = theme => ({
  chip: {
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
  typography: {
    margin: `${theme.spacing(3)}px ${theme.spacing(0)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,
  },
  button: {
    marginLeft: '5px'
  },
  sizeIcon: {
    fontSize: '15px'
  }
});

class Edit extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      checkExist: true,
      reload: false,
      statusMouse: true,
      
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(value) {
    let lat = this.getData(value, 'lat', '')
    let lng = this.getData(value, 'lng', '')
    if(lng && lat){
      this.props.onSubmit(value)
      this.setState({ checkExist: true, reload: !this.state.reload })
    } else {
      this.setState({ checkExist: false , reload: !this.state.reload })
    }
  }

  getMouseInOutAddress = (statusMouse) => {
    this.setState({ statusMouse: statusMouse, reload: !this.state.reload })
  }

  renderChip(order) {
    const {classes} = this.props;
    let driverName = this.getData(order, "driver.lastname", "") + " " + this.getData(order, "driver.firstname", "");

    switch (this.getData(order, 'orderStatus', '')) {
      case "waiting":
        return <Chip label={I18n.t('Label.statusOrder.waiting')} className={classes.chip}/>;
      case "divided":
        return (
          <Grid className={classes.chip}>
            <Chip variant="outlined" color="secondary" label={driverName}/>
            <Typography variant="caption" style={{marginLeft: "8px"}}>
              {I18n.t('Label.statusOrder.divided')}
            </Typography>
          </Grid>
        );

      case "deliveried":
        return (
          <Grid className={classes.chip}>
            <Chip variant="outlined" color="primary" label={driverName}/>
            <Typography variant="caption" style={{marginLeft: "8px"}}>
              {I18n.t('Label.statusOrder.delivered')}
            </Typography>
          </Grid>
        );

      default:
        break;
    }
    return "";
  }

  render() {
    const {classes, customers, areas, order} = this.props
    return (
      <PaperFade>
        <Form className={classes.form} onSubmit={this.onSubmit} > 
          <Grid container>
            <Grid item xs={12} lg={12}>
              {this.renderChip(order)}
            </Grid>

            <Grid item xs={12} lg={3}>
              <FuelsForm
                typeNum="quantity"
                title={I18n.t("Label.order.quantity")}
                order={{...order}}
              />
            </Grid>

            <Grid item xs={12} lg={9}>
              <MainForm
                checkExist={this.state.checkExist}
                customers={customers}
                areas={areas}
                order={order}
                getMouseInOutAddress={this.getMouseInOutAddress}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={() => this.goto('/orders')}>
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
              </Button>
              <Button size='small' type="submit" variant="contained" color="primary" className={classes.button}>
                {I18n.t("Button.confirm")}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Edit);
