import React from 'react';
import prettyBytes from 'pretty-bytes';
import {
  List,
  ListItem,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  IconButton,
  ListItemAvatar,
  Theme,
} from '@material-ui/core';
import { Link, FileCopy, Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

interface PendingTorrentRows {
  totalSize: number;
  renderRows: {
    isMagnet: boolean;
    displayTitle: string;
    fileSize: number;
  }[];
  isAccurate: boolean;
}

interface Props {
  pendingTorrents: PendingTorrentRows;
  onDelete: (pendingIdx: number) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  pendingList: {
    overflow: 'auto',
    flex: 1,
    maxHeight: theme.spacing(40),
  },
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  summaryHintText: {
    marginLeft: 'auto',
  },
}));

const PendingTorrents = ({ pendingTorrents, onDelete }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.pendingList}>
      <List dense>
        {pendingTorrents.renderRows.map((row, idx) => {
          return (
            <ListItem key={idx} divider>
              <ListItemAvatar>
                <Avatar>{row.isMagnet ? <Link /> : <FileCopy />}</Avatar>
              </ListItemAvatar>
              <ListItemText
                className={classes.text}
                primary={row.displayTitle}
                secondary={row.fileSize ? prettyBytes(row.fileSize) : undefined}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(idx)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}

        <div className={classes.summaryHintText}>
          <Typography variant="subtitle1">{`${pendingTorrents.isAccurate ? '' : '~'}${prettyBytes(
            pendingTorrents.totalSize,
          )} Total`}</Typography>
        </div>
      </List>
    </div>
  );
};
export default PendingTorrents;
