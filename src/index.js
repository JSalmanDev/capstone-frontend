import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import App from './App/index';
import * as serviceWorker from './serviceWorker';
import reducer from './store/reducer';
import 'react-notifications/lib/notifications.css';
import 'react-table/react-table.css';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import userActionReducer from './store/reducers/userActionReducer';
import thunk from "redux-thunk";

const creducer = combineReducers({
    reducer,
    userDetails: userActionReducer
})

// const store = (window.devToolsExtension ? window.devToolsExtension () (createStore) : createStore) (creducer, composeEnhancers(applyMiddleware(...middlewares)));
const store = createStore(creducer, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
// const store = createStore(reducer);

const app = (
    <>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </>
);

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.unregister();
