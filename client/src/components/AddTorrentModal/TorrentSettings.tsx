import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, Typography } from '@material-ui/core';

import { makeStyles, DialogContent, DialogActions, List, ListItem } from '@material-ui/core';
import FilePathAutoPicker from 'components/FilePathAutoPicker';

import { toggleAddModal } from 'actions/toolbar';
import { uploadTorrents } from 'actions/torrents';
import networkRequest from 'utils/networkRequest';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
}));

interface TorrentSettingsProps {
  pendingFiles: File[];
  pendingMagnets: string[];
  onBack: () => void;
  onNext: () => void;
}

const TorrentSettings = ({ pendingFiles, pendingMagnets, onBack, onNext }: TorrentSettingsProps) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [destination, setDestination] = useState([] as string[]);

  const onSubmit = async () => {
    try {
      // TODO: Add a spinner to the single upload dialog
      if (pendingFiles.length + pendingMagnets.length === 2) {
        //TODO: Change this back to 1
        await networkRequest(uploadTorrents([...pendingFiles, ...pendingMagnets], destination).request);
        // If there's only a single torrent upload, skip the summary screen
        dispatch(toggleAddModal(false));
      } else {
        dispatch(uploadTorrents([...pendingFiles, ...pendingMagnets], destination));
        onNext();
      }
    } catch (e) {
      console.error(e);
      // Do something here!
    }
  };

  return (
    <>
      <DialogContent>
        {pendingFiles.length > 0 && (
          <List>
            <>
              <Typography variant="overline">Files</Typography>
              {pendingFiles.map(file => {
                return <ListItem key={file.name}>{file.name}</ListItem>;
              })}
            </>
          </List>
        )}

        {pendingMagnets.length > 0 && (
          <List>
            <>
              <Typography variant="overline">Magnets</Typography>
              {pendingMagnets.map(magnet => {
                return <ListItem key={magnet}>{magnet}</ListItem>;
              })}
            </>
          </List>
        )}

        <div className={classes.row}>
          <Typography variant="overline">Destination</Typography>
          <FilePathAutoPicker
            onChange={str => {
              setDestination(str);
            }}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onBack}>Back</Button>
        <Button onClick={onSubmit} color="primary">
          Upload
        </Button>
      </DialogActions>
    </>
  );
};

export default TorrentSettings;
