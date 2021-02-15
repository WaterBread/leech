import { mocked } from 'ts-jest';
import { validate, setValue, getValue, getDefaultValue } from './';
import { read, write } from './file';
import * as model from './model';

const mockedRead = mocked(read);
const mockedWrite = mocked(write);

jest.mock('./file');

const mockConfigFile = () => {
  (model as any).settingModel = {
    someKey: {
      nestedString: { validate: () => [], default: 'test' }
    },
    anotherKey: {
      deep: {
        nestedNumber: { validate: () => [] },
        nestedObject: {
          key: { validate: () => [] }
        }
      }
    }
  };
  mockedRead.mockImplementation(async () => {
    return {
      someKey: {
        nestedString: 'Value1'
      },
      anotherKey: {
        deep: {
          nestedNumber: 123,
          nestedObject: {
            key: 'Value2'
          }
        }
      }
    };
  });

  mockedWrite.mockImplementation(async (contents: any) => {
    return contents;
  });
};

describe('config', () => {
  afterEach(() => jest.resetAllMocks());
  describe('validate', () => {
    it('should validate a single key', () => {
      const validationResult = validate('ui.theme.color.primary', '#ffffff');
      expect(validationResult).toHaveLength(0);
    });

    it('should validate a multiple keys in a parent key', () => {
      const validationResult = validate('ui.theme.color', {
        primary: '#ffffff',
        secondary: '#ffffff',
        tertiary: '#ffffff'
      });
      expect(validationResult).toHaveLength(0);
    });

    it('should return errors on a single key', () => {
      const validationResult = validate(
        'ui.theme.color.primary',
        'not a color'
      );
      expect(validationResult).toHaveLength(1);

      expect(validationResult[0].path).toBe('ui.theme.color.primary');
      expect(validationResult[0].errors).toHaveLength(2);

      expect(validationResult[0].errors[0]).toBe(
        'Hex color must start with a #'
      );
      expect(validationResult[0].errors[1]).toBe(
        'Hex color must have a length of 7'
      );
    });

    it('should return errors on multiple keys', () => {
      const validationResult = validate('ui.theme.color', {
        primary: '#foo',
        secondary: '#bar',
        tertiary: '#baz'
      });
      expect(validationResult).toHaveLength(3);

      for (const error of validationResult) {
        expect(error.errors[0]).toBe('Hex color must have a length of 7');
      }
    });
  });

  describe('setValue', () => {
    afterEach(() => jest.resetAllMocks());
    beforeEach(() => {
      mockConfigFile();
    });
    it('should set a new value', async () => {
      const errors = await setValue('someKey.nestedString', 'a unique value');
      expect(errors).toHaveLength(0);
      expect(mockedWrite.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "anotherKey": Object {
              "deep": Object {
                "nestedNumber": 123,
                "nestedObject": Object {
                  "key": "Value2",
                },
              },
            },
            "someKey": Object {
              "nestedString": "a unique value",
            },
          },
        ]
      `);
    });

    it('should set a parent key with an object value', async () => {
      const errors = await setValue('anotherKey', {
        deep: {
          nestedNumber: 987,
          nestedObject: {
            key: 'new value'
          }
        }
      });
      expect(errors).toHaveLength(0);
      expect(mockedWrite.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "anotherKey": Object {
              "deep": Object {
                "nestedNumber": 987,
                "nestedObject": Object {
                  "key": "new value",
                },
              },
            },
            "someKey": Object {
              "nestedString": "Value1",
            },
          },
        ]
      `);
    });

    it('should return an error if the key doesnt exist', async () => {
      const errors = await setValue('NonExistingKey', 'foobar');
      expect(errors).toHaveLength(1);

      expect(errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "errors": Array [
              "Setting does not exist",
            ],
            "path": "NonExistingKey",
          },
        ]
      `);

      expect(mockedWrite.mock.calls).toHaveLength(0);
    });
  });

  describe('getValue', () => {
    beforeEach(() => mockConfigFile());

    it('should return undefined for a missing key', async () => {
      const value = await getValue('blablabla');
      expect(value).toBeUndefined();
    });
    it('should return a value from the config file', async () => {
      const value = await getValue('someKey.nestedString');
      expect(value).toBe('Value1');
    });
    it('should return an object from a nested key', async () => {
      const value = await getValue('someKey');
      expect(value).toStrictEqual({
        nestedString: 'Value1'
      });

      const value2 = await getValue('anotherKey');
      expect(value2).toStrictEqual({
        deep: {
          nestedNumber: 123,
          nestedObject: {
            key: 'Value2'
          }
        }
      });
    });
  });

  describe('getDefaultValue', () => {
    beforeAll(() => mockConfigFile());
    it('it should return a default value for a given path', () => {
      const value = getDefaultValue('someKey.nestedString');
      expect(value).toBe('test');
    });
    it('it should return undefined for a non existant path', () => {
      const value = getDefaultValue('foobar');
      expect(value).toBe(undefined);
    });
  });
});
