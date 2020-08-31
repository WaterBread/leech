import React from 'react';
import { makeStyles } from '@material-ui/core';
import MultiplePercentBar from '../../MultiplePercentBar';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemLabel: {
    marginBottom: theme.spacing(1),
  },
  itemStat: {},
  row: {
    flex: '1',
    display: 'flex',
  },
  bar: {
    height: theme.spacing(5),
    flex: 1,
    display: 'flex',
  },
}));

const FileSpaceBar = () => {
  const classes = useStyles();
  const items = [
    {
      label: 'Free Space',
      color: '#e3e3e3',
      value: 30,
    },
    {
      label: 'Used Space',
      color: '#aaaaaa',
      value: 70,
    },
  ];

  return (
    <div className={classes.bar}>
      <MultiplePercentBar items={items} />
    </div>
  );
};

const Stats = () => {
  const spaceLeftString = '8.5GB';
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <div className={classes.itemLabel}>Remaining space</div>
      </div>
      <div className={classes.row}>
        <FileSpaceBar />
      </div>
    </div>
  );
};

export default Stats;
