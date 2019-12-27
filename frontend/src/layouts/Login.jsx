import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from '@material-ui/core/styles';
import Login from '../containers/Login/Login';
import Loading from 'containers/Loading/Loading'
import Notistack from 'components/Snackbars/Notistack'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(1) * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

class LoginLayout extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline/>
        <main className={classes.main}>
          <Login/>
        </main>
        <Loading/>
        <Notistack/>
      </div>
    );
  }
}

LoginLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(LoginLayout);
