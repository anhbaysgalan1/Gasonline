import React from 'react'
import {Grid} from '@material-ui/core';
import PaperFade from 'components/Main/PaperFade';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, info);
    console.log(error, info)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <PaperFade showLoading={false}>
          <Grid container justify="center">
            <Grid item xs={12} sm={9} md={6} lg={6} xl={4}>
              <h1>500 Error.</h1>
              <h3>Something went wrong. Please try again!</h3>
            </Grid>
          </Grid>
        </PaperFade>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary
