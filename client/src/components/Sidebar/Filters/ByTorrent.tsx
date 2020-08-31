import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  ExpandLess,
  ExpandMore,
  Done,
  ArrowDownward,
  ArrowUpward,
  Stop,
  AllInclusive,
  Warning,
} from '@material-ui/icons';
import { changeStatusFilter } from 'actions/toolbar';
import StatChip from 'components/StatChip';
import { TorrentStatues } from 'interfaces/torrentStatusSummary';
import { startCase } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTorrentStatusFilter } from 'selectors/toolbar';
import { getTorrentStatusSummary } from 'selectors/torrents';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    icon: {
      minWidth: 'unset',
      marginRight: theme.spacing(1),
      color: theme.palette.secondary.main,

      '& > svg': {
        height: theme.spacing(2),
        width: theme.spacing(2),
      },
    },
    clickThrough: {
      pointerEvents: 'none',
    },
  }),
);

interface FilterItemProps {
  status: TorrentStatues;
  value: number;
  icon: React.ReactElement;
}

const FilterItem = ({ status, value, icon }: FilterItemProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentFilter = useSelector(getTorrentStatusFilter);
  const isSelected = currentFilter === status;

  const setFilter = (status: TorrentStatues) => {
    if (currentFilter === status) {
      dispatch(changeStatusFilter(TorrentStatues.ALL));
    } else {
      dispatch(changeStatusFilter(status));
    }
  };

  return (
    <ListItem button className={classes.nested} onClick={() => setFilter(status)} selected={isSelected}>
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <Typography variant="caption">{startCase(status)}</Typography>

      {value !== 0 && (
        <ListItemSecondaryAction className={classes.clickThrough}>
          <StatChip isSelected={isSelected} content={value} />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

const ByTorrent = () => {
  const classes = useStyles();
  const statusSummary = useSelector(getTorrentStatusSummary);

  const [isTorrentMenuOpen, setTorrentMenuOpen] = React.useState(true);

  return (
    <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
      <ListItem button onClick={() => setTorrentMenuOpen(!isTorrentMenuOpen)}>
        <ListItemText primary="Torrents" />
        {isTorrentMenuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={isTorrentMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <FilterItem status={TorrentStatues.ALL} value={statusSummary.all} icon={<AllInclusive />} />
          <FilterItem status={TorrentStatues.DOWNLOADING} value={statusSummary.downloading} icon={<ArrowDownward />} />
          <FilterItem status={TorrentStatues.UPLOADING} value={statusSummary.uploading} icon={<ArrowUpward />} />
          <FilterItem status={TorrentStatues.STOPPED} value={statusSummary.stopped} icon={<Stop />} />
          <FilterItem status={TorrentStatues.COMPLETED} value={statusSummary.completed} icon={<Done />} />
          <FilterItem status={TorrentStatues.ERROR} value={statusSummary.error} icon={<Warning />} />
        </List>
      </Collapse>
    </List>
  );
};

export default ByTorrent;
