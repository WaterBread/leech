import React from 'react';
import Wireframe from 'components/Wireframe/Overview';
import { makeStyles, Card, CardContent, CardHeader, CardActionArea, CardMedia } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SampleTheme from 'interfaces/sampleTheme';

interface Props {
  onSelect: () => void;
  theme: SampleTheme;
}

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: theme.spacing(30),
  },
}));

const ColorPreview = ({ onSelect, theme }: Props) => {
  const classes = useStyles();
  return (
    <Card className={classes.card} elevation={10}>
      <CardActionArea onClick={onSelect}>
        <CardHeader title={theme.name} />
        <CardMedia>
          <ThemeProvider theme={createMuiTheme(theme.themeOptions)}>
            <Wireframe />
          </ThemeProvider>
        </CardMedia>
      </CardActionArea>
    </Card>
  );
};

export default ColorPreview;
