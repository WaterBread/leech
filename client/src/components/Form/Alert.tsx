import { makeStyles } from '@material-ui/core';
import React from 'react';
import classnames from 'clsx';

interface Props {
  shouldShow: boolean;
  errorTitle?: string;
  errorText: string;
  variant?: 'warning' | 'error' | 'success';
}

const useStyles = makeStyles(() => ({
  root: {
    padding: '6px 16px',
  },
  success: {
    backgroundColor: 'rgb(237, 247, 237)',
    color: 'rgb(30, 70, 32)',
  },
  warning: {
    color: 'rgb(102, 60, 0)',
    backgroundColor: 'rgb(255, 244, 229)',
  },
  error: {
    backgroundColor: 'rgb(253, 236, 234)',
    color: 'rgb(97, 26, 21)',
  },
}));

const Alert = ({ shouldShow, errorText, variant = 'warning' }: Props) => {
  const classes = useStyles();

  if (!shouldShow) return null;
  return (
    <div
      className={classnames(classes.root, {
        [classes.warning]: variant === 'warning',
        [classes.success]: variant === 'success',
        [classes.error]: variant === 'error',
      })}
    >
      {errorText}
    </div>
  );
};

export default Alert;
