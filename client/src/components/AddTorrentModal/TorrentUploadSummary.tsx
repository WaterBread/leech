import React from 'react';
import {
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Button,
  DialogActions,
} from '@material-ui/core';
import { Link, FileCopy, Check, Clear } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getTorrentUploadSummary } from 'selectors/torrents';
import { toggleAddModal } from 'actions/toolbar';

interface Props {
  pendingTorrents: { pendingFiles: File[]; pendingMagnets: string[] };
}

const TorrentUploadSummary = ({ pendingTorrents }: Props) => {
  const dispatch = useDispatch();

  const torrentUploadSummary = useSelector(getTorrentUploadSummary);

  const onCloseClick = () => {
    dispatch(toggleAddModal(false));
  };

  return (
    <DialogContent>
      {torrentUploadSummary.success ? (
        <>
          <List>
            {pendingTorrents.pendingFiles.map((file, idx) => (
              <ListItem key={file.name}>
                <ListItemIcon>
                  <FileCopy />
                </ListItemIcon>
                <ListItemText primary={file.name} />
                {torrentUploadSummary.files[idx].success ? <Check /> : <Clear />}
              </ListItem>
            ))}

            {pendingTorrents.pendingMagnets.map(magnet => (
              <ListItem key={magnet}>
                <ListItemIcon>
                  <Link />
                </ListItemIcon>
                <ListItemText primary={magnet} />
                <Check />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <CircularProgress />
      )}
      <DialogActions>
        <Button onClick={onCloseClick}>Close</Button>
      </DialogActions>
    </DialogContent>
  );
};

export default TorrentUploadSummary;
