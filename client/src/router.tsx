import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Dashboard from 'pages/Dashboard';
import Page from 'components/Page';

const AppRouter = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Page>Test</Page>
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
      </Switch>
      <Redirect exact from="/" to="/dashboard" />
    </Router>
  );
};

export default AppRouter;
