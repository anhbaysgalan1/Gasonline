import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {SnackbarProvider, withSnackbar} from 'notistack';
import {connect} from 'react-redux';

const styles = theme => ({
  // success: { backgroundColor: 'purple' },
  // error: { backgroundColor: 'blue' },
  // warning: { backgroundColor: `${theme.palette.warning.main}` },
  info: {backgroundColor: `${theme.palette.info.main}`},
});

class NotistackConsumer extends React.Component {
  handleClick = () => {
    this.props.enqueueSnackbar('I love snacks.');
  };

  handleClickVariant = variant => () => {
    // variant could be success, error, warning or info
    this.props.enqueueSnackbar('This is a warning message!', {variant});
  };

  componentDidUpdate(prevProps) {
    if (this.props.notify) {
      this.props.enqueueSnackbar(this.props.notify.message, {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        variant: this.props.notify.type
      });
    }
  }

  render() {
    return ""
  }
}

NotistackConsumer.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    notify: state.utility.notify
  }
}
NotistackConsumer = withSnackbar(connect(mapStateToProps)(NotistackConsumer));

class Notistack extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <SnackbarProvider
        maxSnack={3}
        classes={{
          // variantSuccess: classes.success,
          // variantError: classes.error,
          // variantWarning: classes.warning,
          variantInfo: classes.info,
        }}
      >
        <NotistackConsumer/>
      </SnackbarProvider>
    )
  }
}

export default withStyles(styles)(Notistack);
