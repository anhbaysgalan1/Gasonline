import {PureComponent} from 'react';

class BaseComponent extends PureComponent {

  goto(path) {
    if (!this.props.history) {
      return console.error("need export with withRouter() to redirect page.")
    }
    this.props.history.push(path)
  }
}

export {BaseComponent}
export default BaseComponent
