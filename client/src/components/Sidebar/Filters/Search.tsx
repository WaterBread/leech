import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { withStyles, Theme } from '@material-ui/core/styles';

import { changeSearchText } from 'actions/toolbar';
import { getSearchTerm } from 'selectors/toolbar';

const ThemedTextField = withStyles((theme: Theme) => {
  const fontColor = theme.palette.getContrastText(theme.palette.primary.main);
  return {
    root: {
      width: '100%',
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
  const searchTerm = useSelector(getSearchTerm);

  return (
    <div>
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
