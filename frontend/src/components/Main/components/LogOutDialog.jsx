import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {I18n} from 'helpers/I18n';

export default class LogOutDialog extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {I18n.t('Button.logout')}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {I18n.t('Confirm.logout')}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.onHide} variant='outlined' color="primary">
            {I18n.t('Button.cancel')}
          </Button>
          <Button onClick={this.props.onLogout} variant='contained' color="primary">
            {I18n.t('Button.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
