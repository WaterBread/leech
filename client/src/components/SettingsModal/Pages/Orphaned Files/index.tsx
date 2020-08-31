import {
  Button,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  makeStyles,
  Theme,
  Divider,
  LinearProgress,
} from '@material-ui/core';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { getTorrentFileList } from 'actions/torrents';
import { getDirectoryFileList } from 'actions/filelist';
import TorrentFileList from 'interfaces/torrentFileList';
import React, { useState } from 'react';
import { differenceWith, isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { getAllTorrents } from 'selectors/torrents';
import networkRequest from 'utils/networkRequest';
import { FileListResponse } from 'interfaces/filelist';
import PageHeader from '../../PageHeader';

import { sep } from 'path';

import mock from './mock.json';

interface LastScanSummary {
  totalFiles: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  filepathText: { wordBreak: 'break-word' },
  filePathList: {
    overflow: 'auto',
  },
  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  progressBar: {
    width: '100%',
  },
}));

const OrphanedFiles = () => {
  const allTorrents = useSelector(getAllTorrents);
  const [isScanning, setIsScanning] = useState(false);

  const [lastScanSummary, setLastScanSummary] = useState<LastScanSummary>();
  const [orphanedFiles, setOrphanedFiles] = useState<string[][]>(mock);
  const [selectedFiles, setSelectedFiles] = useState<string[][]>([]);

  const classes = useStyles();

  const getFilesFromDirectory = async (basePath: undefined | string[]): Promise<string[][]> => {
    const directoryFileList: FileListResponse = (await networkRequest(getDirectoryFileList(basePath).request)).response;

    const fileList = [];
    for (const file of directoryFileList.files) {
      if (file.isDirectory) {
        fileList.push(...(await getFilesFromDirectory(file.path)));
      } else {
        fileList.push(file.path);
      }
    }

    return fileList;
  };

  const getAllFiles = async () => {
    const fileListPromises: Promise<TorrentFileList>[] = allTorrents.map(async torrent => {
      const result = await networkRequest(getTorrentFileList(torrent.hash).request);
      return result.response;
    });

    const allFilesInUse = await Promise.all(fileListPromises);
    const allFilesInUseMapped = allFilesInUse.reduce((prev, fileList) => {
      return [...prev, ...fileList.fileList.map(file => [...fileList.basePath, ...file])];
    }, [] as string[][]);

    const directoryFileList = await getFilesFromDirectory(undefined);
    const missingFiles = differenceWith(directoryFileList, allFilesInUseMapped, isEqual);

    console.log(missingFiles);
    setOrphanedFiles(missingFiles);
  };

  const onClick = async () => {
    try {
      setIsScanning(true);
      await getAllFiles();
    } catch (e) {
      console.error(e);
    }

    setIsScanning(false);
  };

  const isChecked = (file: string[]) => {
    return selectedFiles.includes(file);
  };

  const onSelectFile = (selectedFile: string[]) => {
    if (!isChecked(selectedFile)) {
      setSelectedFiles([...selectedFiles, selectedFile]);
    } else {
      setSelectedFiles(selectedFiles.filter(item => !isEqual(item, selectedFile)));
    }
  };

  return (
    <div>
      <PageHeader
        title="Orphaned Files"
        subtitle="Scans the torrent directory and lists all files that are not indexed by any existing torrent."
      />
      <div className={classes.centeredContainer}>
        <Button variant="outlined" disabled={isScanning} onClick={onClick}>
          Start Scanning
        </Button>
      </div>

      <Divider className={classes.divider} />

      {isScanning && (
        <div className={classes.progressContainer}>
          <LinearProgress className={classes.progressBar} />
          {/* <Typography>0%</Typography> */}
        </div>
      )}

      {!!orphanedFiles && orphanedFiles.length > 0 && (
        <div className={classes.filePathList}>
          <List dense>
            {orphanedFiles.map(file => {
              const joinedPath = file.join(sep);
              return (
                <ListItem key={joinedPath} role={undefined} dense button onClick={() => onSelectFile(file)}>
                  <ListItemIcon>
                    <Checkbox edge="start" checked={isChecked(file)} tabIndex={-1} disableRipple />
                  </ListItemIcon>
                  <ListItemText className={classes.filepathText} primary={joinedPath} />
                </ListItem>
              );
            })}
          </List>
        </div>
      )}
    </div>
  );
};

export default OrphanedFiles;
