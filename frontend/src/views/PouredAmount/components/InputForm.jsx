import React from 'react';
import PropTypes from 'prop-types';
import {Button, CardActions, Grid, Icon, IconButton} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import {Form} from 'components/Forms';
import {BaseView} from 'views/BaseView';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';

const styles = theme => ({
  paper: {
    [theme.breakpoints.down('xs')]: {
      padding: '8px 8px',
      margin: 0
    },
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

class Index extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    }
  }

  onClickBtn = () => {
    this.setState({isEditing: !this.state.isEditing})
  }

  renderFooterActions = (isEditing, classes) => {
    if (isEditing) return (
      <div style = {{paddingTop: "20px"}}>
        <Button size='small' variant="outlined" color="primary" onClick={this.onClickBtn}>
          {I18n.t('Button.cancel')}
        </Button>
        <Button className={classes.button} size='small' variant="contained" color="primary" type="submit">
          {I18n.t('Button.confirm')}
        </Button>
      </div>
    );

    return (
      <IconButton className={classes.positionLeftBottom} color='primary' onClick={this.onClickBtn}>
        <Icon>control_point</Icon>
      </IconButton>
    )
  }

  renderFormInput = (isEditing) => {
    if (!isEditing) return '';

    return (
      <Grid container spacing={1}>
        {Utils.renderFormInputFuels({}, !isEditing)}
      </Grid>
    )
  }

  onSubmit(values) {
    const {onSubmit} = this.props;
    // validate data
    values = Utils.formatDataImportFuels(values);
    onSubmit(values)
  }

  render() {
    const {classes} = this.props
    const {isEditing} = this.state

    return (
      <Form onSubmit={(value) => this.onSubmit(value)}>
        {this.renderFormInput(isEditing)}
        <CardActions>
          {this.renderFooterActions(isEditing, classes)}
        </CardActions>
      </Form>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);
