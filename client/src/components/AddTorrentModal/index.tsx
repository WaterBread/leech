import { toggleAddModal } from 'actions/toolbar';
import get from 'lodash/get';
import set from 'lodash/set';

import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import { Form } from 'react-final-form';

import TorrentSettings from './TorrentSettings';
import Alert from 'components/Form/Alert';
import TorrentUploadSummary from './TorrentUploadSummary';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    '&:first-child': {
      marginRight: theme.spacing(1),
    },
    '&:last-child': {
      marginLeft: theme.spacing(1),
    },
  },
  magnetLinkInput: {
    paddingBottom: theme.spacing(1),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  select: {
    width: theme.spacing(12),
  },
  dropzone: {
    height: theme.spacing(16),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  dropzoneHighlight: {
    color: theme.palette.primary.light,
  },
  groupTitle: {
    marginBottom: theme.spacing(2),
  },
  pendingSummaryLabel: {
    display: 'flex',
    justifyContent: 'center',
  },
  pendingSummaryStat: {},
  row: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),

    '& > div': {
      marginLeft: theme.spacing(2),
    },

    '&::first-child': {
      marginLeft: `-${theme.spacing(2)}`,
    },
  },
}));

const getSummaryText = (pendingFiles: File[], pendingMagnets: string[]) => {
  const summaryText = [];
  if (pendingFiles.length > 0) {
    // Lame plural detection but I don't care too much
    if (pendingFiles.length === 1) {
      summaryText.push(`${pendingFiles.length} file`);
    } else {
      summaryText.push(`${pendingFiles.length} files`);
    }
  }

  if (pendingMagnets.length > 0) {
    if (pendingMagnets.length === 1) {
      summaryText.push(`${pendingMagnets.length} magnet link`);
    } else {
      summaryText.push(`${pendingMagnets.length} magnet links`);
    }
  }

  return summaryText.join(', ');
};

interface AddTorrentContentProps {
  onSubmit: (values: { pendingFiles: File[]; pendingMagnets: string[] }) => void;
  onClose: () => void;
}
const AddTorrentContent = ({ onSubmit, onClose }: AddTorrentContentProps) => {
  const classes = useStyles();

  const [magnetLinkText, setMagnetLinkText] = useState('');

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingMagnets, setPendingMagnets] = useState<string[]>([]);

  const [hasNextBeenClicked, setNextClicked] = useState(false);

  const addPendingTorrent = (pendingTorrent: string | FileList) => {
    if (typeof pendingTorrent === 'string') {
      setPendingMagnets([...pendingMagnets, pendingTorrent]);
    } else {
      const fileListArray = Array.from(pendingTorrent);
      setPendingFiles([...pendingFiles, ...fileListArray]);
    }
  };

  const addMagnetLink = () => {
    if (magnetLinkText !== '') {
      addPendingTorrent(magnetLinkText);
      setMagnetLinkText('');
    }
  };

  const summaryText = useMemo(() => getSummaryText(pendingFiles, pendingMagnets), [pendingFiles, pendingMagnets]);

  return (
    <>
      <Form
        onSubmit={() => {
          onSubmit({ pendingFiles, pendingMagnets });
        }}
        validate={() => {
          const validationErrors = {};
          if (pendingFiles.length === 0 && pendingMagnets.length === 0) {
            set(validationErrors, 'pendingTorrents', 'Must have at least one torrent added.');
          }
          return validationErrors;
        }}
      >
        {props => (
          <>
            <DialogContent className={classes.root}>
              <Box className={classes.container} display="flex" flexDirection="column" flex={1}>
                <Typography className={classes.groupTitle} variant="caption">
                  Files to upload
                </Typography>

                <Input
                  value={magnetLinkText}
                  className={classes.magnetLinkInput}
                  placeholder="Magnet link"
                  onChange={e => setMagnetLinkText(get(e, 'target.value', ''))}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      addMagnetLink();
                    }
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          addMagnetLink();
                        }}
                      >
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  }
                />

                <div className={classes.row}>
                  <Button variant="outlined" component="label">
                    Browse
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={e => {
                        if (e.target.files) addPendingTorrent(e.target.files);
                      }}
                    />
                  </Button>

                  <div className={classes.pendingSummaryLabel}>
                    <div className={classes.pendingSummaryStat}>
                      {summaryText && <Typography variant="caption">{summaryText}</Typography>}
                    </div>
                  </div>
                </div>
              </Box>
            </DialogContent>
            <Alert
              variant="error"
              shouldShow={!!props.errors.pendingTorrents && hasNextBeenClicked}
              errorText={props.errors.pendingTorrents}
            />
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="primary"
                type="submit"
                onClick={() => {
                  if (magnetLinkText !== '') {
                    addPendingTorrent(magnetLinkText);
                  }
                  setTimeout(() => {
                    setNextClicked(true);
                    props.handleSubmit();
                  });
                }}
              >
                Next
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </>
  );
};

export default function AddTorrentModal() {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(0);
  const [pendingTorrents, setPendingTorrents] = useState<{ pendingFiles: File[]; pendingMagnets: string[] }>({
    pendingFiles: [],
    pendingMagnets: [],
  });

  const handleClose = () => {
    dispatch(toggleAddModal(false));
  };

  const pages: { [num: number]: JSX.Element } = {
    0: (
      <AddTorrentContent
        onSubmit={values => {
          setPendingTorrents(values);
          setCurrentPage(1);
        }}
        onClose={handleClose}
      />
    ),
    1: (
      <TorrentSettings
        onBack={() => {
          setCurrentPage(0);
        }}
        onNext={() => {
          setCurrentPage(2);
        }}
        pendingFiles={pendingTorrents.pendingFiles}
        pendingMagnets={pendingTorrents.pendingMagnets}
      />
    ),
    2: <TorrentUploadSummary pendingTorrents={pendingTorrents} />,
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth>
      <DialogTitle id="form-dialog-title">Add Torrents</DialogTitle>
      {pages[currentPage]}
    </Dialog>
  );
}
