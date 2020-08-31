import React from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
    borderRadius: theme.spacing(0.7),
  },
  item: {
    flex: 1,
  },
}));

interface ItemStat {
  label: string;
  value: number; // Number between 0 - 100
  color: string; // Hex color string
}

interface Props {
  items: ItemStat[];
}

const MultiplePercentBar = ({ items }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {items.map(item => (
        <div key={item.label} className={classes.item} style={{ flexBasis: `${item.value}%` }}>
          <Tooltip placement="top" title={`${item.value}%`}>
            <div style={{ backgroundColor: item.color, height: '100%' }} />
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

export default MultiplePercentBar;
