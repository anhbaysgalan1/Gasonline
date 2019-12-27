import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Button, CardActions, Grid, Icon, Typography} from '@material-ui/core';
import PaperFade from "components/Main/PaperFade";
import {Form} from 'components/Forms';
import {BaseView} from 'views/BaseView';
import CreateForm from './components/CreateForm';
import {dateFormatDefault} from 'config/constant';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';
import moment from 'moment';

moment.defaultFormat = dateFormatDefault;

const styles = theme => ({
  paper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.down('xs')]: {
      padding: '8px 8px',
    }
  },
  positionLeftBottom: {
    [theme.breakpoints.down('xs')]: {
      position: "fixed",
      left: '8px',
      bottom: '8px'
    }
  },
  button: {
    marginLeft: '5px'
  }
})

class Create extends BaseView {
  constructor(props) {
    super(props)
  }

  onSubmit(values) {
    const {onSubmit} = this.props;
    // validate data
    values = Utils.formatDataExportFuels(values);
    onSubmit(values)
  }

  render() {
    const {classes, order, previous, typeExport} = this.props;
    let deliveryDate = this.getData(order, 'deliveryDate', '');
    if (deliveryDate) deliveryDate = moment(deliveryDate).format();

    return (
      <PaperFade className={classes.paper}>
        <Typography align='center'>{deliveryDate}</Typography>

        <hr/>
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
        <Form onSubmit={(value) => this.onSubmit(value)}>
          <CreateForm typeExport={typeExport}/>

          <CardActions>
            <div className={classes.positionLeftBottom}>
              <Button size='small' variant="outlined" color="primary" onClick={previous}>
                <Icon style={{fontSize: '15px'}}>arrow_back_ios</Icon> {I18n.t('Button.back')}
              </Button>
              <Button className={classes.button} size='small' variant="contained" color="primary" type="submit">
                {I18n.t('Button.confirm')}
              </Button>
            </div>
          </CardActions>
        </Form>
      </PaperFade>
    )
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Create);
