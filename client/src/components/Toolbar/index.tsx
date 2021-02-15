import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayIcon from '@material-ui/icons/PlayArrow';
import SettingsIcon from '@material-ui/icons/Settings';
import StopIcon from '@material-ui/icons/Stop';
import SyncIcon from '@material-ui/icons/Sync';
import { toggleAddModal, toggleDeleteModal, toggleSettingsModal } from 'actions/toolbar';
import { recheckTorrent, startTorrent, stopTorrent } from 'actions/torrents';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedTorrents } from 'selectors/toolbar';

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

  const selectedTorrents = useSelector(getSelectedTorrents);
  const hasTarget = selectedTorrents.length > 0;

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
            selectedTorrents.forEach(torrent => {
              dispatch(startTorrent(torrent.hash));
            });
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
            selectedTorrents.forEach(torrent => {
              dispatch(stopTorrent(torrent.hash));
            });
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
            selectedTorrents.forEach(torrent => {
              dispatch(recheckTorrent(torrent.hash));
            });
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
