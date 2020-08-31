import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface Props {
  title: string;
  subtitle: string;
}

const PageHeader = ({ title, subtitle }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {subtitle}
        </Typography>
      )}
    </div>
  );
};

export default PageHeader;
