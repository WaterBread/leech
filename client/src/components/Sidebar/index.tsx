import { darken } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ByTorrent from './Filters/ByTorrent';
import ByTracker from './Filters/ByTracker';
import Search from './Filters/Search';
import Stats from './Stats';

const useStyles = makeStyles(theme => {
  const backgroundColor = darken(theme.palette.primary.main, 0.1);
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '17rem',
      overflow: 'auto',
      backgroundColor: backgroundColor,
      color: theme.palette.getContrastText(backgroundColor),
      boxShadow: '2px 0px 10px -3px rgba(0,0,0,0.75)',
      zIndex: 1,
      '& > div': {
        padding: theme.spacing(2),
      },
    },
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {},
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    divider: {
      flex: 1,
    },
  };
});

const Sidebar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Search />
      <ByTorrent />
      <ByTracker />
      <div className={classes.divider} />
      <Stats />
      {/* <Divider /> */}
    </div>
  );
};

export default Sidebar;
