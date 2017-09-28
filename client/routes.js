//Requirements
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Home from './components/Home';
import Profile from './components/Profile';
import Books from './components/Books';
import Login from './components/Login';
import App from './components/App';
import Account from './components/Account';
import About from './components/About';
import NotFound from './components/NotFound';

//Store
import store, { history } from './store';

//Routes
const routes = (
      <Provider store={ store }>
        <Router history={ history }>
          <Route path="/" component={ App }>
  					<IndexRoute component={ Home } />
            <Route path="/about" component={ About } />
  					<Route path="/login" component={ Login } />
  					<Route path="/profile" component={ Profile } />
            <Route path="/account" component={ Account } />
  					<Route path="/books" component={ Books } />
            <Route path="*" component={ NotFound }></Route>
          </Route>
        </Router>
      </Provider>
		);

export default routes;
