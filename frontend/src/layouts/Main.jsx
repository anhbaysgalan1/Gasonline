import React, {Suspense} from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import {withStyles} from '@material-ui/core/styles';
import LeftSide from '../components/Main/LeftSide'
import routes from 'config/routes.jsx'
import {Route, Switch, withRouter} from 'react-router-dom'
import Loading from 'containers/Loading/Loading'
import LoadingComponent from 'components/Progress/Loading'
import Notistack from 'components/Snackbars/Notistack'
import http from 'helpers/http'
import permission from 'helpers/permission'
import AccessDenied from 'components/Pages/AccessDenied'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  widthSidebar: { 
    [theme.breakpoints.up('md')]: {
      // width: '258px !important',
    }
  }, 
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: '#eeeeee',
    padding: `0px`,
    width: `calc(100% - ${theme.drawerWidth}px)`,
    [theme.breakpoints.up('md')]: {
      padding: '0px 0px',
      marginTop: '-7px',
      // padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 1}px 0px`,
    },
  }
})

class Main extends React.Component {
  constructor(props) {
    super(props)
    http.initOnce(props)
  }

  renderRoutes() {
    let result = []
    let index = 0
    for (let route of routes) {
      result.push(<Route
        key={index++}
        path={route.path}
        exact={route.exact || route.children ? true : false}
        name={route.name}
        component={() => this.renderComponent(route)}
      />)
    }
    return result
  }

  renderLoading = () => {
    return (
      <LoadingComponent show={true}/>
    )
  }

  renderComponent(route) {
    const {classes} = this.props;
    const Component = permission.hasPermission(route.role) ? route.component : AccessDenied
    return <div className={classes.root}>
      <CssBaseline/>
      {/* <div className={classes.widthSidebar} > */}
        <LeftSide route={route}/>
      {/* </div> */}
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <Suspense fallback={this.renderLoading()}>
          <Component route={route}/>
        </Suspense>
      </main>
    </div>
  }

  render() {
    return (<React.Fragment>
        <Switch>
          {this.renderRoutes(routes)}
        </Switch>
        <Loading/>
        <Notistack/>
      </React.Fragment>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(withRouter(Main));
