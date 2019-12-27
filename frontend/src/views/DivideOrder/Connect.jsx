import React, {Component} from 'react'

const AppContext = React.createContext()

class Provider extends Component {
  constructor(props) {
    super(props);
  }

  x = () => {
    console.log("xxxx")
  }

  render() {
    return (
      <AppContext.Provider value={{x: this.x}}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

const connect = (Component) => (props) => {
  return (
    <AppContext.Consumer>
      {(value) => {
        console.log(value);
        return <Component {...value} {...props}/>
      }}
    </AppContext.Consumer>
  )
}

export {
  Provider,
  connect
}

