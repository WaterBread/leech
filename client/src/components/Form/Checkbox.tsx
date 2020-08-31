import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { Field } from 'react-final-form';

interface Props {
  name: string;
  label: string;
  validate?: (value: boolean) => boolean;
}

const CheckboxField = ({ name, label, validate }: Props) => {
  return (
    <Field name={name} validate={validate}>
      {({ input: { name, onChange, value, checked, ...restInput }, meta, ...rest }) => {
        return (
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={onChange} name={name} value={value} />}
            label={label}
          />
        );
      }}
    </Field>
  );
};

export default CheckboxField;
