import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  backdrop: {
    position: "absolute",
    width: "100%",
    overflow: "hidden",
    zIndex: theme.zIndex.appBar - 1,
    top: "0px",
    bottom: "0px",
    background: "rgb(255,255,255,0.3)"
  },
  loading: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    width: "40px",
    margin: "auto",
  }
})

class LoadingCircle extends Component {
  render() {
    const {show, classes, ...otherProps} = this.props
    if (!show) return ''
    return <div className={classes.backdrop}>
      <div className={classes.loading}>
        <CircularProgress
          style={{
            animationDuration: '350ms',
          }}
          disableShrink
          size={30}
          thickness={4}
          {...otherProps}
        />
      </div>
    </div>
  }
}

export default withStyles(styles)(LoadingCircle)
