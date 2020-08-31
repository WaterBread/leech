import {
  FormControlLabel,
  makeStyles,
  Switch,
  ThemeOptions,
  GridList,
  GridListTile,
  GridListTileBar,
} from '@material-ui/core';

import get from 'lodash/get';

import { Form, Field } from 'react-final-form';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeLocalSetting } from 'actions/settings';
import HexColorOption from './HexColorOption';
import ModalButtons from '../../Buttons';
import ColorPreview from './Preview';
import { sampleThemes } from './constants';
import PageHeader from 'components/SettingsModal/PageHeader';

const useStyles = makeStyles(theme => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  carousel: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    transform: 'translateZ(0)',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(3),

    '& > div': {
      marginRight: theme.spacing(2),
    },
  },
}));

const ColorSettings = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentTheme: ThemeOptions = useSelector(state => get(state, 'settings.theme'));

  const onReset = () => {
    // dispatch(resetTheme());
  };

  const onSubmit = (values: ThemeOptions) => {
    console.log('Submitting', values);
    dispatch(changeLocalSetting('theme', values));
  };

  return (
    <Form onSubmit={onSubmit} initialValues={currentTheme}>
      {props => (
        // eslint-disable-next-line react/prop-types
        <form className={classes.column} onSubmit={props.handleSubmit}>
          <PageHeader title="Color Settings" subtitle="Choose a theme or manually configure the theme colors" />

          <div className={classes.carousel}>
            <GridList className={classes.gridList} cols={2.5}>
              {sampleThemes.map(theme => (
                <ColorPreview
                  theme={theme}
                  key={`theme-${theme.name}`}
                  onSelect={() => {
                    console.log(theme);
                    dispatch(changeLocalSetting('theme', theme.themeOptions));
                  }}
                />
              ))}
            </GridList>
          </div>

          <FormControlLabel
            control={
              <Field name={'palette.type'}>
                {({ input: { name, onChange, value, ...restInput }, ...rest }) => {
                  return (
                    <Switch
                      {...rest}
                      name={name}
                      value={value}
                      checked={value === 'dark'}
                      inputProps={restInput}
                      onChange={(e, checked) => {
                        const mode = checked ? 'dark' : 'light';
                        onChange(mode);
                      }}
                    />
                  );
                }}
              </Field>
            }
            label="Dark Mode"
          />

          <HexColorOption optionPath="palette.primary.main" label="Primary Color" />
          <HexColorOption optionPath="palette.secondary.main" label="Secondary Color" />
          <ModalButtons
            onReset={() => {
              onReset();
              // eslint-disable-next-line react/prop-types
              props.form.reset();
            }}
          />
        </form>
      )}
    </Form>
  );
};

export default ColorSettings;
