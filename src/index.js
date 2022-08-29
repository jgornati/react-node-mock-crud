import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import './assets/css/Index.css';
import 'react-quill/dist/quill.snow.css';
import './styles/globals.css'

//Router
import { Route, Router, Switch } from "react-router-dom";
import history from './history';
//Redux
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import appReducers from './reducers/index';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
//Components
import Layout from "./components/Layout/Layout.js";
import '@fontsource/roboto';
import { StylesProvider } from '@material-ui/core/styles';
import { Redirect } from "react-router";
// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
let createStoreWithMiddleware;
if (process.env.NODE_ENV !== 'production') {
    const loggerMiddleware = createLogger();
    createStoreWithMiddleware = applyMiddleware(thunk, loggerMiddleware)(createStore);
    console.log("Mode: Debug")
} else {
    console.log("Mode: Production")
    createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

    //delete console.log
    (function () {
        let method;
        const noop = function noop() {
        };
        const methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        let length = methods.length;
        const console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];
            console[method] = noop;
        }
    }());
}

const store = createStoreWithMiddleware(appReducers);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <StylesProvider injectFirst>
                <Switch>
                    <Route path="/" component={Layout}/>
                </Switch>
            </StylesProvider>
        </Router>
    </Provider>, document.getElementById('root'));
