import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Button, Grid, Icon, Typography} from '@material-ui/core';
import PaperFade from "components/Main/PaperFade";
import {BaseView} from 'views/BaseView';
import {dateFormatDefault} from 'config/constant';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';
import moment from 'moment';

moment.defaultFormat = dateFormatDefault;

const styles = theme => ({
  editBtn: {
    position: "absolute",
    right: 16,
  },
  editBtnWrap: {
    position: "relative",
  },
  positionLeftBottom: {
    [theme.breakpoints.down('xs')]: {
      position: "fixed",
      left: '8px',
      bottom: '8px'
    },
  },
});

class Create extends BaseView {
  constructor(props) {
    super(props)
  }

  render() {
    const {classes, order, previous, generalDelivery, separateDelivery} = this.props;
    let deliveryDate = this.getData(order, 'deliveryDate', '');
    if (deliveryDate) deliveryDate = moment(deliveryDate).format();

    return (
      <PaperFade className={classes.paper}>
        <center>
          <Typography>{deliveryDate}</Typography>
          <hr/>
        </center>

        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={8} lg={8}>
            <Typography color='primary'>{this.getData(order, 'code', 'N/A')}</Typography>
          </Grid>
          <Grid item xs={4} lg={4}>
            <Typography align='right' color='primary'>
              {Utils._formatDeliveryTime(this.getData(order, 'deliveryTime', ''))}
            </Typography>
          </Grid>
        </Grid>

        <br/>
        <center>
          <Grid container justify="center" alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h6'>{I18n.t("Breadcrumb.indexDelivery")}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary" onClick={generalDelivery}>
                {I18n.t("Button.generalDelivery")}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary" onClick={separateDelivery}>
                {I18n.t("Button.separateDelivery")}
              </Button>
            </Grid>
          </Grid>
        </center>

        <br/>
        <Button size="small" variant="contained" color="primary" className={classes.positionLeftBottom}
                onClick={previous}>
          <Icon style={{fontSize: '15px'}}>arrow_back_ios</Icon> {I18n.t("Button.back")}
        </Button>
      </PaperFade>
    )
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Create);
