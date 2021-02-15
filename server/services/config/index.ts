import { settingModel } from './model';
import { read, write } from './file';
import { ErrorType } from './interfaces';
import { get, merge, isPlainObject, set } from 'lodash';

export { PathMapping, ErrorType } from './interfaces';

export const validate = (path: string, value: any): ErrorType[] => {
  const setting = get(settingModel, path);

  if (!setting) {
    return [{ path, errors: ['Setting does not exist'] }];
  }

  if (typeof setting.validate === 'function') {
    const validationResult = setting.validate(value);
    if (validationResult.length > 0) {
      return [{ path, errors: setting.validate(value) }];
    }
  } else {
    // It's a parent key, validate them all
    const keys = Object.keys(setting);
    return keys.reduce((prev, key) => {
      if (!get(value, key)) {
        return [{ path: `${path}.${key}`, errors: ['Missing nested value'] }];
      }

      const validationResult = validate(`${path}.${key}`, get(value, key));
      if (validationResult.length > 0) {
        return [...prev, ...validationResult];
      }
      return prev;
    }, []);
  }

  return [];
};

export const setValue = async (path: string, value: any): Promise<ErrorType[]> => {
  const errors = validate(path, value);

  if (errors.length > 0) return errors;

  const existingValues = await read();
  const existingKeyValue = get(existingValues, path);

  let newValues = value;
  if (existingKeyValue && isPlainObject(existingKeyValue)) {
    newValues = merge(existingKeyValue, value);
  }

  set(existingValues, path, newValues);
  await write(existingValues);

  return errors;
};

export const getValue = async (path: string) => {
  const existingValues = await read();
  return get(existingValues, path);
};

export const getDefaultValue = (path: string) => {
  return get(settingModel, `${path}.default`);
};
