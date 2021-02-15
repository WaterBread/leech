import { InputParameter } from './interfaces';
import { dCommands } from './attributes';

export const getAttributeFromString = (attrName: string): InputParameter | undefined => {
  return dCommands[attrName];
};

export const getValidFields = (fields: string[]) => {
  const validFields: InputParameter[] = [];
  for (const field of fields) {
    if (typeof dCommands[field] !== 'undefined') {
      validFields.push({ ...dCommands[field], apiName: field });
    }
  }
  return validFields;
};
