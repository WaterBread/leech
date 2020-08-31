import { MappedTorrent } from 'interfaces/torrent';
import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';

import { withStyles, Theme, darken, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  progressBarRoot: {
    height: '100%',
  },
  percent: {
    position: 'absolute',
    paddingLeft: theme.spacing(0.3),
    paddingRight: theme.spacing(0.3),
    paddingTop: theme.spacing(0.1),
    paddingBottom: theme.spacing(0.1),
    borderRadius: '.3rem',
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Primary = withStyles((theme: Theme) => ({
  colorPrimary: {
    backgroundColor: theme.palette.secondary.main,
  },
  barColorPrimary: {
    backgroundColor: darken(theme.palette.secondary.main, 0.2),
  },
}))(LinearProgress);

const Stopped = withStyles({
  colorPrimary: {
    backgroundColor: '#f6f6f6',
  },
  barColorPrimary: {
    backgroundColor: '#e3e3e3',
  },
})(LinearProgress);

const Hashing = withStyles({
  colorPrimary: {
    backgroundImage:
      'linear-gradient(45deg, #e0e0e0 25%, #c4c4c4 25%, #c4c4c4 50%, #e0e0e0 50%, #e0e0e0 75%, #c4c4c4 75%, #c4c4c4 100%)',
    backgroundSize: '14.14px 14.14px',
    animation: '$slide-right 5s linear infinite',
  },
  barColorPrimary: {
    backgroundColor: '#00695c',
  },
  '@keyframes slide-right': {
    '100%': {
      backgroundPosition: '100% 100%',
    },
  },
})(LinearProgress);

interface Props {
  torrent: MappedTorrent;
}

const getProgressBar = (torrent: MappedTorrent) => {
  if (torrent.isHashing) return Hashing;
  if (torrent.state === 0) return Stopped;
  else return Primary;
};

const ProgressBar = ({ torrent }: Props) => {
  const classes = useStyles();
  const Progress = getProgressBar(torrent);

  const percentComplete = torrent.percentComplete * 100;

  return (
    <Tooltip title={`${percentComplete.toFixed(2)}%`} placement="top">
      <div className={classes.progressBarRoot}>
        <Progress value={percentComplete} variant="determinate" />
      </div>
    </Tooltip>
  );
};

export default ProgressBar;
