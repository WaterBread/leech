import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, List, ListItem, ListItemText, Paper, CircularProgress, Typography } from '@material-ui/core';
import { Folder, FileCopyRounded, SubdirectoryArrowLeft } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getDirectoryFileList } from 'actions/filelist';
import { getCurrentFileList } from 'selectors/filelist';
import clsx from 'clsx';
import { CurrentDirectory } from 'interfaces/filelist';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    zIndex: 2,

    minWidth: theme.spacing(10),
    maxHeight: theme.spacing(20),
    overflow: 'auto',
  },
  icon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  previousText: {
    color: theme.palette.text.hint,
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    height: theme.spacing(20),
  },
}));

interface Props {
  onItemClick: (path: string[]) => void;
  className?: string;
  initialDirectory?: string[];
  onClose: () => void;
}

const ListOfFiles = ({ files, onClick }: { files: CurrentDirectory['files']; onClick: (path: string[]) => void }) => {
  const classes = useStyles();
  return (
    <>
      {files.map(file => {
        if (file.isDirectory) {
          return (
            <ListItem key={file.name} button onClick={() => onClick(file.path)}>
              <Folder className={classes.icon} />
              <ListItemText primary={file.name} />
            </ListItem>
          );
        } else {
          return (
            <ListItem key={file.name} disabled>
              <FileCopyRounded className={classes.icon} />
              <ListItemText primary={file.name} />
            </ListItem>
          );
        }
      })}
    </>
  );
};

const FileListError = () => {
  return (
    <div>
      <Typography>Failed to get filelist</Typography>
    </div>
  );
};

const FileList = ({ onItemClick, onClose, className, initialDirectory }: Props) => {
  const [currentDirectory, setCurrentDirectory] = useState<string[]>(initialDirectory ? initialDirectory : []);
  const classes = useStyles();
  const nodeRef = React.createRef() as React.RefObject<any>;

  const dispatch = useDispatch();
  const currentFiles = useSelector(getCurrentFileList);

  const onClick = (path: string[]) => {
    setCurrentDirectory(path);
    onItemClick(path);
  };

  const getLastDirectory = (path: string[]) => {
    const modifiedPath = [...path];
    modifiedPath.pop();
    return modifiedPath;
  };

  const clickOutsideComponent = (e: MouseEvent) => {
    if (!nodeRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', clickOutsideComponent, false);

    return () => {
      document.removeEventListener('mousedown', clickOutsideComponent, false);
    };
  });

  useEffect(() => {
    dispatch(getDirectoryFileList(currentDirectory));
  }, [dispatch, currentDirectory]);

  const isRoot = currentDirectory.length === 0;

  return (
    <Paper className={clsx(classes.root, className)} ref={nodeRef}>
      {currentFiles.hasFailed && <FileListError />}
      {currentFiles.isLoading ? (
        <div className={classes.loadingSpinner}>
          <CircularProgress />
        </div>
      ) : (
        <List dense>
          {!isRoot && (
            <ListItem button onClick={() => onClick(getLastDirectory(currentDirectory))}>
              <ListItemText className={classes.previousText} primary="Previous" />
              <SubdirectoryArrowLeft className={classes.icon} />
            </ListItem>
          )}

          <ListOfFiles files={currentFiles.files} onClick={onClick} />
        </List>
      )}
    </Paper>
  );
};

export default FileList;
