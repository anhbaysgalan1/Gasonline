import React, {Suspense} from 'react';
import BaseContainer from 'containers/BaseContainer';
import {Fade, Paper} from '@material-ui/core';
import LoadingCircle from 'components/Progress/LoadingCircle'
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  Paper: {
    boxShadow: "none",
    [theme.breakpoints.down('xs')]: {
      border: "none",
      padding: theme.spacing(2)
    },
    [theme.breakpoints.up('sm')]: {
      border: "1px solid #e2e2e2",
      margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(2)}px`
    }
  }
})

class PaperFade extends BaseContainer {
  constructor(props) {
    super(props)
    this.state = {
      in: false
    }
  }

  componentDidMount() {
    /**
     * sử dụng setTimeout để render view loading trước khi thật, để tránh bị lag view
     */
    this.timer = setTimeout(() => {
      this.setState({
        in: true
      })
    }, 1)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  renderLoading() {
    const {showLoading} = this.props
    return (
      <div style={{height: "calc(100vh - 112px)", position: "relative"}}>
        <LoadingCircle
          show={showLoading}
        />
      </div>
    )
  }

  /**
   * Sử dụng load view loading trước,
   * sau đó mới load component bằng lazy() của React để tăng độ mượt cho view
   */
  renderComponent() {
    if (!this.state.in) return this.renderLoading()
    let {children} = this.props
    return (
      <Suspense fallback={this.renderLoading()}>
        <Fade in={this.state.in} timeout={500}>
          <div>
            {children}
          </div>
        </Fade>
      </Suspense>
    )
  }

  /**
   * Tạo 1 paper trống và hiển thị loading nếu có props showLoading = true
   */
  render() {
    let {children, showLoading, classes, ...otherProps} = this.props
    return (
      <Paper
        classes={{root: classes.Paper}}
        {...otherProps}
      >
        {this.renderComponent()}
      </Paper>
    );
  }
}

export default withStyles(styles)(PaperFade)
