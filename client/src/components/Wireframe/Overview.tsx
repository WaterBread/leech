import React from 'react';
import { makeStyles, List, ListItem, Typography, Divider, darken, Paper } from '@material-ui/core';
import StatChip from 'components/StatChip';
import classnames from 'clsx';

const useStyles = makeStyles(theme => {
  const backgroundColor = darken(theme.palette.primary.main, 0.1);
  return {
    root: {
      // display: 'flex',
      flexDirection: 'row',
      height: '200px',
      minWidth: '400px',
    },
    sidebar: {
      minWidth: '50px',
      backgroundColor: backgroundColor,
      color: theme.palette.getContrastText(backgroundColor),
    },
    sidebarItems: {
      alignItems: 'center',
      '& > span': {
        maxWidth: 'min-content',
        margin: theme.spacing(0.5),
      },
    },
    header: {
      minHeight: '30px',
      backgroundColor: theme.palette.primary.main,
    },
    table: {
      flex: 1,
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
    },
    smallText: {
      fontSize: theme.spacing(1.5),
    },
  };
});

const WireframePreview = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <div className={classes.sidebar}>
          <div className={classnames(classes.sidebarItems, classes.column)}>
            {[1, 2, 3].map(stat => (
              <StatChip isSelected={stat === 1} key={`example-stat-${stat}`} content={stat} />
            ))}
          </div>
        </div>

        <div className={classes.column}>
          <div className={classes.header} />
          <Paper square className={classes.table}>
            <List dense>
              {[1, 2, 3, 4, 5].map(itemNum => (
                <div key={`example-${itemNum}`}>
                  <ListItem>
                    <Typography className={classes.smallText}>{`Torrent number ${itemNum}`}</Typography>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default WireframePreview;
