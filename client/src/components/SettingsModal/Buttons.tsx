import React from 'react';
import { makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  formButtons: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: theme.spacing(1),
  },
}));

interface Props {
  onReset?: () => void;
}

const Buttons = ({ onReset }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.formButtons}>
      {onReset && <Button onClick={onReset}>Reset</Button>}
      <Button type="submit">Save</Button>
    </div>
  );
};

export default Buttons;
