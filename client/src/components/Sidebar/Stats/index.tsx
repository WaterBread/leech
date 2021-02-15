import { darken, makeStyles, useTheme } from '@material-ui/core';
import { fetchDiskSpace } from 'actions/system';
import React, { useEffect, useState } from 'react';
import networkRequest from 'utils/networkRequest';
import MultiplePercentBar from '../../MultiplePercentBar';
import prettyBytes from 'pretty-bytes';
import get from 'lodash/get';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemLabel: {
    marginBottom: theme.spacing(1),
  },
  itemSublabel: {
    overflow: 'hidden',
    marginLeft: theme.spacing(2),
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  itemStat: {},
  row: {
    flex: '1',
    display: 'flex',
    justifyContent: 'space-between'
  },
  bar: {
    height: theme.spacing(1),
    flex: 1,
    display: 'flex',
  }
}));

const FileSpaceBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [diskSummary, setDiskSummary] = useState();
  
  const percentageUsed = get(diskSummary, 'diskSpace.percentageUsed', 0)
  const percentageUnused = 100 - percentageUsed;

  const fileSpaceItems = [
    {
      label: 'Used Space',
      color: theme.palette.secondary.main,
      value: percentageUsed,
      tooltip: prettyBytes(get(diskSummary, 'diskSpace.usedBytes', 0))
    },
    {
      label: 'Free Space',
      color: darken(theme.palette.secondary.main, 0.3),
      value: percentageUnused,
      tooltip: prettyBytes(get(diskSummary, 'diskSpace.freeBytes', 0))
    },
  ];

  useEffect(() => {
    networkRequest(fetchDiskSpace().request).then(remainingSpace => {
      if (remainingSpace) {
        setDiskSummary(remainingSpace);
      }
    })
  }, [])

  return (
    <div className={classes.bar}>
      <MultiplePercentBar items={fileSpaceItems} />
    </div>
  );
};

const Stats = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <div className={classes.itemLabel}>Remaining space</div>
        <div className={classes.itemSublabel}>Disk 1</div>
      </div>
      <div className={classes.row}>
        <FileSpaceBar />
      </div>
    </div>
  );
};

export default Stats;
