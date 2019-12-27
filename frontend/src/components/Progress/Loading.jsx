import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const debug = require("debug")("mq:loading")
const styles = theme => {
  return {
    loading: {
      position: "fixed",
      width: "100%",
      height: "3px",
      overflow: "hidden",
      zIndex: 9999,
      top: "0px",
      left: "0px"
    },
    linearColorPrimary: {
      backgroundColor: '#ececec',
    },
    linearBarColorPrimary: {
      backgroundColor: '#000',
    },
  }
}

class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      completed: 100,
      show: false
    }
    this.timer = null
    this.timeout = null
  }

  componentDidMount() {
    this.startLoading(this.props)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.startLoading(this.props)
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    clearTimeout(this.timeout)
  }

  startLoading(props) {
    let newCompleted = 100
    if (props.show) newCompleted = 0
    this.setState({
      completed: newCompleted
    })
    if (newCompleted === 0) {
      clearTimeout(this.timeout)
      this.setState({
        show: true
      }, () => {
        clearInterval(this.timer);
        this.timer = setInterval(this.progress, 200);
      })
    } else {
      clearInterval(this.timer);
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.setState({
          show: false
        })
      }, 200)
    }
  }

  progress = () => {
    const {completed} = this.state;
    const diff = Math.random() * 10;
    this.setState({completed: Math.min(completed + diff, 100)});
  };

  render() {
    const {show, classes} = this.props
    debug("show loading: ", show, this.state.show, this.state.completed)
    if (!this.state.show) return ''
    return <div className={classes.loading}>
      <LinearProgress
        variant="determinate"
        value={this.state.completed}
        classes={{
          colorPrimary: classes.linearColorPrimary,
          barColorPrimary: classes.linearBarColorPrimary,
        }}
      />
    </div>
  }
}

export default withStyles(styles)(Loading)
