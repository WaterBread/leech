import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAddModal, toggleDeleteModal, toggleSettingsModal } from 'actions/toolbar';
import { stopTorrent, startTorrent, recheckTorrent } from 'actions/torrents';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';

import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import SyncIcon from '@material-ui/icons/Sync';
import StopIcon from '@material-ui/icons/Stop';
import PlayIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';

import { getSelectedTorrent } from 'selectors/toolbar';

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const ToolbarComponent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedTorrent = useSelector(getSelectedTorrent);
  const hasTarget = !!selectedTorrent.torrent;

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={() => dispatch(toggleAddModal(true))}
        >
          <AddIcon />
        </IconButton>
        <IconButton edge="start" className={classes.menuButton} color="inherit">
          <CreateIcon />
        </IconButton>
        <Divider className={classes.menuButton} orientation="vertical" flexItem />
        <IconButton
          disabled={!hasTarget}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={() => {
            if (selectedTorrent.torrent) dispatch(startTorrent(selectedTorrent.torrent.hash));
          }}
        >
          <PlayIcon />
        </IconButton>
        <IconButton
          disabled={!hasTarget}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={() => {
            if (selectedTorrent.torrent) dispatch(stopTorrent(selectedTorrent.torrent.hash));
          }}
        >
          <StopIcon />
        </IconButton>
        <IconButton
          disabled={!hasTarget}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={() => {
            if (selectedTorrent.torrent) dispatch(recheckTorrent(selectedTorrent.torrent.hash));
          }}
        >
          <SyncIcon />
        </IconButton>
        <IconButton
          disabled={!hasTarget}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={() => dispatch(toggleDeleteModal(true))}
        >
          <DeleteIcon />
        </IconButton>

        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={() => dispatch(toggleSettingsModal(true))}
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ToolbarComponent;
