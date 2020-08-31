import { TextField } from '@material-ui/core';
import React from 'react';
import { Field } from 'react-final-form';

type validateFunction = (value: any) => boolean;

interface Props {
  name: string;
  helperText?: string;
  label?: string;
  validate?: validateFunction;
}

const Text = ({ name, helperText, label, validate }: Props) => {
  return (
    <Field name={name} validate={validate}>
      {({ input: { name, onChange, value, ...restInput }, meta, ...rest }) => {
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

export default Text;
