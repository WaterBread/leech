import React from 'react';
import { render } from 'react-dom';
import Router from './router';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import CustomThemeProvider from 'components/CustomThemeProvider';
import { Provider } from 'react-redux';

import './index.css';
import 'typeface-roboto';

import configureStore from './store';
import SettingsWatcher from 'components/SettingsWatcher';

const { store } = configureStore({});

render(
  <Provider store={store}>
    <SettingsWatcher>
      <CustomThemeProvider>
        {theme => {
          return (
            <ThemeProvider
              theme={createMuiTheme({
                ...theme,
              })}
            >
              <CssBaseline>
                <Router />
              </CssBaseline>
            </ThemeProvider>
          );
        }}
      </CustomThemeProvider>
    </SettingsWatcher>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
