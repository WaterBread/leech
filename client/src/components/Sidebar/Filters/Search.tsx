import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';

import { changeSearchText } from 'actions/toolbar';
import { getSearchTerm } from 'selectors/toolbar';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // padding: theme.spacing(2),
  },
}));

const ThemedTextField = withStyles((theme: Theme) => {
  const fontColor = theme.palette.getContrastText(theme.palette.primary.main);
  return {
    root: {
      '& .MuiInput-root': {
        color: fontColor,
      },
      '& .MuiInputLabel-root': {
        color: fontColor,
      },
      '& label.Mui-focused': {
        color: theme.palette.secondary.main,
      },
      '& .MuiInput-underline:hover::before': {
        borderBottomColor: fontColor,
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: fontColor,
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.secondary.main,
      },
    },
  };
})(TextField);

const SearchBar = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const searchTerm = useSelector(getSearchTerm);

  return (
    <div className={classes.root}>
      <ThemedTextField
        label="Search"
        value={searchTerm}
        onChange={e => {
          dispatch(changeSearchText(e.target.value));
        }}
      />
    </div>
  );
};

export default SearchBar;
