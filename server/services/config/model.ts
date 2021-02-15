import { ModelSetting, PathMapping } from './interfaces';
import { get, isArray, has } from 'lodash';

const isHexColorString = (value: string) => {
  const errors = [];
  if (typeof value !== 'string') errors.push('Invalid hex color');
  if (!value.startsWith('#')) errors.push('Hex color must start with a #');
  if (value.length !== 7) errors.push('Hex color must have a length of 7');

  return errors;
};

const isPathArray = (value: PathMapping[]) => {
  const errors = [];
  if (!isArray(value)) errors.push('Must be an array');
  value.forEach((val, idx) => {
    if (!has(val, 'sourcePath')) errors.push(`[${idx}] is missing required attribute: sourcePath`);
    if (!has(val, 'destinationPath')) errors.push(`[${idx}] is missing required attribute: destinationPath`);
  });
  return errors;
};

export const generateDefaults = (path?: string) => {
  const settingObj = path ? get(settingModel, path) : settingModel;

  const keys = Object.keys(settingObj);
  return keys.reduce((prev, key) => {
    const obj = get(settingObj, key);
    if (obj.default) {
      return { ...prev, [key]: obj.default };
    } else if (!obj.validate) { // Really sloppy way to check if it's a nested key
      const newPath = path ? `${path}.${key}` : key;
      return { ...prev, [key]: generateDefaults(newPath) };
    }
    return prev;
  }, {});
};

export const settingModel: ModelSetting = ({
  ui: {
    theme: {
      color: {
        primary: { validate: isHexColorString, default: '#ffffff' },
        secondary: { validate: isHexColorString, default: '#ffffff' },
        tertiary: { validate: isHexColorString, default: '#ffffff' }
      }
    }
  },
  pathMapping: {
    validate: isPathArray,
    default: []
  }
});
