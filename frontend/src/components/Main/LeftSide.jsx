import React from 'react';
import {withRouter} from 'react-router-dom';
import {
  AppBar, Divider, Drawer, Hidden, 
  IconButton, Toolbar, Typography, Button, Link
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {withStyles} from '@material-ui/core/styles';
import Sidebar from './Sidebar';
import LogOut from './components/LogOut';
import _ from 'lodash'

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: theme.drawerWidth,
      flexShrink: 0,
    },
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    marginLeft: theme.drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: "100%",
      zIndex: 1201
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: { // Set chiều rộng Sidebar
    width: theme.drawerWidth,
    // [theme.breakpoints.up('md')]: {
      // width: '250px',
    // }
  },
  paperAnchorLeft: {
    borderRight: "none",
    boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  Typography: {
    paddingRight: `${theme.spacing.unit * 3}px`,
    marginLeft: `${theme.spacing.unit * 2}px`
  },
  button: {
    marginRight: "20px"
  }
})

class LeftSide extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mobileOpen: false,
    };
  }

  handleDrawerToggle = () => {
    this.setState({mobileOpen: !this.state.mobileOpen});
  };

  onLogout = () => {
    localStorage.clear();
    this.props.history.push('/login')
  }

  setLang (name) {
    localStorage.setItem('lang', name)
  }

  render() {
    let pathname = _.get(this.props, "history.location.pathname", '') 
    const {classes, theme, route} = this.props;
    const title = typeof route.title === "function" ? route.title() : "Default Page";
    document.title = title
    // const user = JSON.parse(localStorage.getItem('user'))
    return <React.Fragment>
      <AppBar position="fixed" className={classes.appBar} color="default">
        <Toolbar>
          <Hidden smUp>
            <IconButton 
              size='small' edge="start" 
              onClick={this.handleDrawerToggle}
              className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon/>
            </IconButton>
            <Typography className={classes.Typography} color="inherit" noWrap className={classes.grow}>
              {title}
            </Typography>
          </Hidden>
          <Hidden xsDown>
            <Typography className={classes.Typography} variant="h6" color="inherit" noWrap className={classes.grow}>
              {title}
            </Typography>
          </Hidden>
          <Link color='primary' href={`${pathname}`} className={classes.button} onClick={ () => this.setLang("vi")}  >VN</Link>
          <Link color='primary' href={`${pathname}`} className={classes.button} onClick={ () => this.setLang("ja")} >JP</Link>
          <LogOut onLogout={this.onLogout}/>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={this.props.container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
          >
            <div className={classes.toolbar}/>
            <Divider/>
            <Sidebar route={route}/>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{ paper: classes.drawerPaper, paperAnchorLeft: classes.paperAnchorLeft }}
            variant="permanent"
            open
          >
            <div className={classes.toolbar}/>
            <Divider/>
            <Sidebar route={route}/>
          </Drawer>
        </Hidden>
      </nav>
    </React.Fragment>
  }
}

export default withStyles(styles, {withTheme: true})(withRouter(LeftSide));
