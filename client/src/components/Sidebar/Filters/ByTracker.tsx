import { changeTrackerFilter } from 'actions/toolbar';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTorrentTrackerFilter } from 'selectors/toolbar';
import { getTrackerSummary } from 'selectors/trackers';

import {
  ListItemSecondaryAction,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme, fade } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StatChip from 'components/StatChip';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    clickThrough: {
      pointerEvents: 'none',
    },
    icon: {
      minWidth: 'unset',
      marginRight: theme.spacing(1),
      color: theme.palette.secondary.main,

      '& > img': {
        height: theme.spacing(2),
        width: theme.spacing(2),
      },
    },
  }),
);

const ByTracker = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const trackerSummary = useSelector(getTrackerSummary);
  const trackerFilter = useSelector(getTorrentTrackerFilter);

  const [isTorrentMenuOpen, setTorrentMenuOpen] = React.useState(true);

  const keys: string[] = Object.keys(trackerSummary);

  const setFilter = (tracker: string) => {
    if (trackerFilter === tracker) {
      // Click it twice
      dispatch(changeTrackerFilter(''));
    } else {
      dispatch(changeTrackerFilter(tracker));
    }
  };

  return (
    <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
      <ListItem button onClick={() => setTorrentMenuOpen(!isTorrentMenuOpen)}>
        <ListItemText primary="Trackers" />
        {isTorrentMenuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={isTorrentMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {keys.map(key => {
            const isSelected = trackerFilter === key;

            return (
              <ListItem
                key={key}
                button
                className={classes.nested}
                onClick={() => setFilter(key)}
                selected={isSelected}
              >
                <Typography variant="caption">{key}</Typography>

                {trackerSummary[key] !== 0 && (
                  <ListItemSecondaryAction className={classes.clickThrough}>
                    <StatChip isSelected={isSelected} content={trackerSummary[key]} />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
};

export default ByTracker;
