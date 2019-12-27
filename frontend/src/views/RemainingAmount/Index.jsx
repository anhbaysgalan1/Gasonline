import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Grid} from '@material-ui/core';
import PaperFade from 'components/Main/PaperFade';
import {Form} from 'components/Forms';
import {BaseView} from 'views/BaseView';
import Utils from 'helpers/utility';

const styles = theme => ({
  paper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.down('xs')]: {
      padding: '8px 8px',
      margin: 0
    },
  },
})

class Index extends BaseView {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const {classes, vehicle} = this.props;
    let remainingFuels = this.getData(vehicle, 'remain', {});
    // remainingFuels = {kerosene: "200", diesel: "550", gasoline: "340"};
    return (
      <PaperFade className={classes.paper}>
        <br/>
        <Form>
          <Grid container spacing={1}>
            {Utils.renderFormInputFuels(remainingFuels, true, 0)}
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);
