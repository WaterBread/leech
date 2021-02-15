import {
  Checkbox,
  FormControlLabel,
  Tooltip,
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Accordion,
  Paper,
  DialogActions,
  AccordionSummary,
  ListSubheader,
  AccordionDetails,
  darken,
  useTheme,
  Collapse,
} from '@material-ui/core';
import { Check, Clear, ExpandMore } from '@material-ui/icons';
import { deleteFiles, checkFilesExist } from 'actions/filelist';
import { toggleDeleteModal } from 'actions/toolbar';
import { deleteTorrent, getTorrentFileList } from 'actions/torrents';
import Alert from 'components/Form/Alert';
import TorrentFileList from 'interfaces/torrentFileList';
import { uniq } from 'lodash';
import get from 'lodash/get';
import includes from 'lodash/includes';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExistingFiles } from 'selectors/filelist';
import { getSelectedTorrents } from 'selectors/toolbar';
import networkRequest from 'utils/networkRequest';
import { FileListState } from 'interfaces/filelist';
import StatChip from 'components/StatChip';
import Loading from 'components/Loading';

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
  nested: { paddingLeft: theme.spacing(4) },
  noShrink: { whiteSpace: 'nowrap' },
}));

const singleDelete = 'Are you sure you want to delete this torrent?';
const multiDelete = 'Are you sure you want to delete these torrents?';

enum DeleteState {
  INITIAL,
  FILES_MISSING,
  FILES_DELETE_FAILED,
}

interface FileList {
  torrentName: string;
  torrentHash: string;
  torrentSize: number;
  torrentFiles: TorrentFileList;
}

const DeleteTorrentModal = () => {
  const dispatch = useDispatch();
  const selectedTorrents = useSelector(getSelectedTorrents);

  const [fileList, setFileList] = useState([] as FileList[]);
  const [mergedFiles, setMergedFiles] = useState([] as string[][]);

  const [existingFiles, setExistingFiles] = useState([] as FileListState[]);
  const [isDeleting, setDeleting] = useState(false);

  const [currentStage, setStage] = useState(DeleteState.INITIAL);

  const [withDataChecked, setWithDataChecked] = useState(false);
  const [deleteSummary, setDeleteSummary] = useState({ success: [], failure: [] });

  const getDeletableFilesFromList = (list: FileList) => {
    const basePath = list.torrentFiles.basePath;
    const torrentFiles = list.torrentFiles.fileList;
    return torrentFiles.map(path => [...basePath, ...path]);
  };

  console.log(existingFiles);

  useEffect(() => {
    const updateFileList = async () => {
      const promises = selectedTorrents.map(torrent => networkRequest(getTorrentFileList(torrent.hash).request));
      const filesOfTorrents = (await Promise.all(promises)).map((torrentFiles, index) => {
        const torrent = selectedTorrents[index];
        return {
          torrentName: torrent.filename,
          torrentHash: torrent.hash,
          torrentSize: torrent.sizeBytes,
          torrentFiles: torrentFiles.response,
        };
      });
      setFileList(filesOfTorrents);
    };

    updateFileList();
  }, [selectedTorrents]);

  useEffect(() => {
    const getDeletableFilesFromListArray = (fileList: FileList[]) => {
      const files = fileList.reduce((prevList, list) => {
        return [...prevList, ...getDeletableFilesFromList(list)];
      }, [] as string[][]);
      return uniq(files);
    };
    const mergedFiles = getDeletableFilesFromListArray(fileList);
    setMergedFiles(mergedFiles);
  }, [fileList]);

  const handleClose = () => {
    dispatch(toggleDeleteModal(false));
  };

  const deleteSelectedFiles = async () => {
    try {
      setDeleting(true);
      const responseBody = await networkRequest(deleteFiles(mergedFiles).request);
      const success = get(responseBody, 'response.success', []);
      const failure = get(responseBody, 'response.failure', []);

      return { success, failure };
    } finally {
      setDeleting(false);
    }
  };

  const removeTorrentFromClient = async () => {
    const requests = fileList.map(list => networkRequest(deleteTorrent(list.torrentHash).request));
    await Promise.all(requests);
    dispatch(toggleDeleteModal(false));
  };

  const handleAccept = async () => {
    if (withDataChecked) {
      const { success = [], failure = [] } = await deleteSelectedFiles();
      setDeleteSummary({ success, failure });

      if (failure.length > 0) {
        return;
      }
    }

    await removeTorrentFromClient();
  };

  useEffect(() => {
    if (
      existingFiles.some(file => {
        if (file.existingFiles) {
          return file.existingFiles.some(f => f === false);
        }
        return false;
      })
    ) {
      setStage(DeleteState.FILES_MISSING);
    }
  }, [existingFiles]);

  useEffect(() => {
    const checkFiles = async () => {
      const filesThatExist = await Promise.all(
        fileList.map(list => {
          return networkRequest(checkFilesExist(getDeletableFilesFromList(list)).request);
        }),
      );
      setExistingFiles(filesThatExist.map(existingFiles => existingFiles.response));
    };

    checkFiles();
  }, [fileList]);

  const classes = useStyles();

  const getExistingFileIcon = (exists: boolean, isFailure: boolean) => {
    if (isFailure) {
      return (
        <Tooltip title="Delete failed">
          <Clear color="error" />
        </Tooltip>
      );
    }
    return exists ? (
      <Tooltip title="File found">
        <Check />
      </Tooltip>
    ) : (
      <Tooltip title="File not found">
        <Clear />
      </Tooltip>
    );
  };

  const getActionButtons = () => {
    switch (currentStage) {
      case DeleteState.INITIAL:
        return (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAccept}>Delete</Button>
          </>
        );
      case DeleteState.FILES_MISSING:
        return (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAccept}>Delete Anyway</Button>
          </>
        );
      case DeleteState.FILES_DELETE_FAILED:
        return (
          <>
            <Button onClick={handleClose}>Keep</Button>
            <Button onClick={handleAccept}>Remove</Button>
          </>
        );
    }
  };

  const theme = useTheme();

  return (
    <Dialog open={true} onClose={handleClose} fullWidth scroll="body">
      <DialogTitle id="form-dialog-title">Delete Torrent</DialogTitle>

      <DialogContent className={classes.root}>
        <Typography>{singleDelete}</Typography>
        <FormControlLabel
          control={<Checkbox checked={withDataChecked} onChange={() => setWithDataChecked(!withDataChecked)} />}
          label="Delete data?"
        />
        {fileList.map((list, listIdx) => (
          <>
            <List style={{ backgroundColor: darken(theme.palette.background.paper, 0.1) }}>
              <ListItem>
                <ListItemText primary={list.torrentName} />
                <div className={classes.noShrink}>
                  <StatChip content={list.torrentSize} />
                </div>
              </ListItem>

              <Collapse in={withDataChecked} timeout="auto" unmountOnExit>
                <List dense className={classes.nested}>
                  {getDeletableFilesFromList(list).map((file: string[], fileIdx) => {
                    return (
                      <ListItem key={`${list.torrentHash}-${fileIdx}`} divider>
                        <ListItemText className={classes.torrentRow} primary={file.join('/')} />
                        {get(existingFiles[fileIdx], file.join('/'))}
                        {getExistingFileIcon(
                          get(existingFiles, `[${listIdx}][${fileIdx}]`, false),
                          includes(deleteSummary.failure, file),
                        )}
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </List>
          </>
        ))}
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
