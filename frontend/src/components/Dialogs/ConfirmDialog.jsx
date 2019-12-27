import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {I18n} from "helpers/I18n";

class ConfirmDialog extends React.Component {
  constructor() {
    super()
    this.state = {
      open: false
    };
    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  show(data = null) {
    this.setState({
      open: true,
      data: data
    })
  }

  hide() {
    this.setState({
      open: false
    })
  }

  onCancel() {
    const {onCancel} = this.props
    this.hide()
    if (typeof onCancel === "function") {
      onCancel(this.state.data)
    }
  }

  onSubmit() {
    const {onSubmit} = this.props
    this.hide()
    if (typeof onSubmit === "function") {
      onSubmit(this.state.data)
    }
  }

  render() {
    let {title, content, textCancel, textSubmit} = this.props
    title = title || ""
    content = content || ""
    textCancel = textCancel || I18n.t('Button.cancel')
    textSubmit = textSubmit || I18n.t('Button.ok')

    return (
      <Dialog
        open={this.state.open}
        onClose={this.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onCancel} color="primary">
            {textCancel}
          </Button>
          <Button onClick={this.onSubmit} color="primary" autoFocus>
            {textSubmit}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmDialog;
