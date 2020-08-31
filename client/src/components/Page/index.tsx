import React, { ReactNode } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import Content from './Content';
import Sidebar from 'components/Sidebar';
import Loading from 'components/Loading';

import './index.css';

interface Props {
  children: ReactNode;
  isLoading?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexDirection: 'row',
      display: 'flex',
      height: '100%',
    },
    content: {
      width: '100%',
      flexDirection: 'column',
      display: 'flex',
    },
    sidebar: {
      width: '10rem', // TODO: Theme spacing
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);

const PageComponent = ({ children, isLoading }: Props): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content}>{isLoading ? <Loading /> : children}</div>
    </div>
  );
};

export default PageComponent;
