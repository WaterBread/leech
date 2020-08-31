import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, Typography, lighten } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,

    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: theme.spacing(10),
  },
  selectedChip: {
    backgroundColor: lighten(theme.palette.secondary.main, 0.3),
    color: theme.palette.secondary.contrastText,
  },
}));

interface Props {
  isSelected: boolean;
  content: string | number;
}

const StatChip = ({ isSelected, content }: Props) => {
  const classes = useStyles();

  const chipClasses = [classes.chip];
  if (isSelected) chipClasses.push(classes.selectedChip);

  if (content) {
    return (
      <Typography className={chipClasses.join(' ')} variant="caption">
        {content}
      </Typography>
    );
  } else {
    return null;
  }
};

export default StatChip;
