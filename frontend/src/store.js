import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import RootReducer from './reducers/RootReducer';
import {composeWithDevTools} from 'redux-devtools-extension';

export default function configureStore(initialState = {}) {
  const store = createStore(
    RootReducer,
    composeWithDevTools(applyMiddleware(thunk))
  );
  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(RootReducer);
    });
  }
  return {store}
}
