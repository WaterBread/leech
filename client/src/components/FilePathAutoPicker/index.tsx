import { IconButton, TextField, InputAdornment, Theme, TextFieldProps } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import FileList from './FileList';
import { sep } from 'path';
import { useSelector } from 'react-redux';
import { getSetting } from 'selectors/settings';

interface Props {
  // initialDirectory?: string;
  onChange: (str: string[]) => void;
  label?: string;
  initialValue?: string[];
  fieldProps?: TextFieldProps;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
  },
  input: {
    display: 'flex',
  },
  icon: {
    flex: 1,
    display: 'flex',
    height: `${theme.spacing(2)}px !important`, //ebin
    width: `${theme.spacing(2)}px !important`,
  },
  filePicker: {
    position: 'fixed',
  },
}));

const FilePathAutoPicker = ({ onChange, initialValue, label, fieldProps }: Props) => {
  const classes = useStyles();

  const settingPath = useSelector(getSetting('downloadPath'));

  // Either use the given path or default to the one from settings
  const initialPath = initialValue ? initialValue : settingPath;
  const [pathValue, setPathValue] = useState(initialPath);
  const [isFileListOpen, setFileListOpen] = useState(false);

  useEffect(() => {
    onChange(pathValue);
  }, [pathValue, onChange]);

  const openFilePicker = () => {
    setFileListOpen(true);
  };

  console.log(pathValue);
  const value = pathValue ? pathValue.join(sep) : '';

  return (
    <div className={classes.root}>
      <TextField
        className={classes.input}
        value={value}
        label={label}
        onChange={e => {
          const split = e.target.value.split(sep);
          setPathValue(split);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={openFilePicker}>
                <Search className={classes.icon} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...fieldProps}
      />
      {isFileListOpen && (
        <FileList
          className={classes.filePicker}
          initialDirectory={pathValue}
          onItemClick={e => {
            console.log(e);
            setPathValue(e);
          }}
          onClose={() => {
            setFileListOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default FilePathAutoPicker;
