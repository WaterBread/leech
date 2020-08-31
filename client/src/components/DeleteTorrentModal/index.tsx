import { Checkbox, FormControlLabel, Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { checkFilesExist, deleteFiles } from 'actions/filelist';
import { toggleDeleteModal } from 'actions/toolbar';
import { deleteTorrent, getTorrentFileList } from 'actions/torrents';
import Alert from 'components/Form/Alert';
import get from 'lodash/get';
import includes from 'lodash/includes';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExistingFiles } from 'selectors/filelist';
import { getSelectedTorrent } from 'selectors/toolbar';
import { getTorrentFileList as getTorrentFileListSelector } from 'selectors/torrents';
import networkRequest from 'utils/networkRequest';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    paddingBottom: theme.spacing(1),
  },
  torrentName: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  select: {
    width: theme.spacing(12),
  },
  torrentRow: {
    wordWrap: 'break-word',
  },
  fileListContainer: {
    maxHeight: 200,
    overflow: 'auto',
    width: '100%',
  },
}));

const singleDelete = 'Are you sure you want to delete this torrent?';
const multiDelete = 'Are you sure you want to delete these torrents?';

enum DeleteState {
  INITIAL,
  FILES_MISSING,
  FILES_DELETE_FAILED,
}

const DeleteTorrentModal = () => {
  const dispatch = useDispatch();
  const selectedTorrent = useSelector(getSelectedTorrent);
  const selectedTorrentFileList = useSelector(getTorrentFileListSelector(selectedTorrent.hash));
  const existingFiles = useSelector(getExistingFiles);

  const [currentStage, setStage] = useState(DeleteState.INITIAL);

  const [withDataChecked, setWithDataChecked] = useState(false);
  const [deleteSummary, setDeleteSummary] = useState({ success: [], failure: [] });

  const handleClose = () => {
    dispatch(toggleDeleteModal(false));
  };

  const deleteSelectedFiles = async () => {
    const deleteFilePaths = selectedTorrentFileList.fileList.map(path => [
      ...selectedTorrentFileList.basePath,
      ...path,
    ]);
    const responseBody = await networkRequest(deleteFiles(deleteFilePaths).request);
    const success = get(responseBody, 'response.success', []);
    const failure = get(responseBody, 'response.failure', []);

    return { success, failure };
  };

  const removeTorrentFromClient = () => {
    if (selectedTorrent.hash) networkRequest(deleteTorrent(selectedTorrent.hash).request);
    dispatch(toggleDeleteModal(false));
  };

  const handleAccept = async () => {
    if (withDataChecked) {
      const { success, failure } = await deleteSelectedFiles();
      setDeleteSummary({ success, failure });

      if (failure.length > 0) {
        return;
      }
    }

    removeTorrentFromClient();
  };

  useEffect(() => {
    if (selectedTorrent.hash && withDataChecked) dispatch(getTorrentFileList(selectedTorrent.hash));
  }, [withDataChecked, selectedTorrent.hash, dispatch]);

  useEffect(() => {
    if (selectedTorrentFileList.fileList && selectedTorrentFileList.fileList.length > 0) {
      const checkFilePaths = selectedTorrentFileList.fileList.map(path => [
        ...selectedTorrentFileList.basePath,
        ...path,
      ]);
      dispatch(checkFilesExist(checkFilePaths));
    }
  }, [selectedTorrentFileList.fileList, selectedTorrentFileList.basePath, dispatch]);

  useEffect(() => {
    if (existingFiles.some(file => file === false)) {
      setStage(DeleteState.FILES_MISSING);
    }
  }, [existingFiles]);

  const classes = useStyles();

  const title = selectedTorrent.torrent ? selectedTorrent.torrent.filename : undefined;

  const getSecondaryText = () => {
    if (selectedTorrent.torrent) {
      return selectedTorrent.torrent.sizeBytes;
    }
  };

  const getExistingFileIcon = (index: number, isFailure: boolean) => {
    const existingStatus = existingFiles[index];
    if (isFailure) {
      return (
        <Tooltip title="Delete failed">
          <ClearIcon color="error" />
        </Tooltip>
      );
    }
    return existingStatus ? (
      <Tooltip title="File found">
        <CheckIcon />
      </Tooltip>
    ) : (
      <Tooltip title="File not found">
        <ClearIcon />
      </Tooltip>
    );
  };

  const getActionButtons = () => {
    switch (currentStage) {
      case DeleteState.INITIAL:
        return (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAccept} color="primary">
              Delete
            </Button>
          </>
        );
      case DeleteState.FILES_MISSING:
        return (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAccept} color="primary">
              Delete Anyway
            </Button>
          </>
        );
      case DeleteState.FILES_DELETE_FAILED:
        return (
          <>
            <Button onClick={handleClose} color="primary">
              Keep
            </Button>
            <Button onClick={handleAccept} color="secondary">
              Remove
            </Button>
          </>
        );
    }
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth scroll="body">
      <DialogTitle id="form-dialog-title">Delete Torrent</DialogTitle>

      <DialogContent className={classes.root}>
        <Typography>{singleDelete}</Typography>
        <List dense>
          <ListItem divider>
            <ListItemText className={classes.torrentRow} primary={title} secondary={getSecondaryText()} />
          </ListItem>
        </List>
        <FormControlLabel
          control={<Checkbox checked={withDataChecked} onChange={() => setWithDataChecked(!withDataChecked)} />}
          label="Delete data?"
        />
        {withDataChecked && (
          <Paper className={classes.fileListContainer}>
            <List dense>
              {selectedTorrentFileList.fileList &&
                selectedTorrentFileList.fileList.map((file: string[], idx) => (
                  <ListItem key={idx} divider>
                    <ListItemText className={classes.torrentRow} primary={file.join('/')} />
                    {get(existingFiles, file.join('/'))}{' '}
                    {getExistingFileIcon(idx, includes(deleteSummary.failure, file))}
                  </ListItem>
                ))}
            </List>
          </Paper>
        )}
      </DialogContent>

      <Alert
        errorText="Some of the files could not be found and therefore cannot be deleted."
        shouldShow={currentStage === DeleteState.FILES_MISSING && withDataChecked}
      />

      <Alert
        errorText="Some files failed to delete. Do you want to remove the torrent?"
        shouldShow={currentStage === DeleteState.FILES_DELETE_FAILED}
      />

      <DialogActions>{getActionButtons()}</DialogActions>
    </Dialog>
  );
};

export default DeleteTorrentModal;
