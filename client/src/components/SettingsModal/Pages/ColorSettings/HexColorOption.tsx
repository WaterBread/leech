import React from 'react';
import { Field } from 'react-final-form';

import { TextField } from '@material-ui/core';

interface Props {
  optionPath: string;
  label: string;
}

const helperText = 'Invalid HEX color';

export const isHexColor = (value: string) => {
  return !/^#[0-9A-F]{6}$/i.test(value);
};

const HexColorOption = ({ label, optionPath }: Props) => {
  return (
    <Field name={optionPath} validate={isHexColor}>
      {({ input: { name, onChange, value, ...restInput }, meta, ...rest }) => {
        console.log(meta.error);
        const showError = meta.error && meta.touched;
        return (
          <TextField
            {...rest}
            name={name}
            helperText={showError ? helperText : undefined}
            error={showError}
            inputProps={restInput}
            onChange={onChange}
            value={value}
            label={label}
          />
        );
      }}
    </Field>
  );
};

export default HexColorOption;
