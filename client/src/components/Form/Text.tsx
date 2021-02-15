import { TextField } from '@material-ui/core';
import React from 'react';
import { Field } from 'react-final-form';

type validateFunction = (value: any) => boolean;

interface Props {
  name: string;
  helperText?: string;
  label?: string;
  validate?: validateFunction;
  type?: 'number' | 'text';
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
}

const parseNumber = (value: any) => {
  console.log('parseNumber', isNaN(value), value);
  if (isNaN(value)) return value;
  else return Number(value);
};

const Text = ({ name, helperText, label, validate, type = 'text', variant }: Props) => {
  return (
    <Field name={name} validate={validate} parse={type === 'number' ? parseNumber : undefined}>
      {({ input: { name, onChange, value, ...restInput }, meta, ...rest }) => {
        const showError = meta.error && meta.touched;
        console.log(value, typeof value);
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
            type={type}
            variant={variant as any}
          />
        );
      }}
    </Field>
  );
};

export default Text;
