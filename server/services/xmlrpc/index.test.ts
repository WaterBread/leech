import { serializeMethodCall } from './';

describe('xmlrpc', () => {
  describe('serializeMethodCall', () => {
    it('it should format a simple method correctly', () => {
      const xml = serializeMethodCall('myMethodName', ['test']);
      expect(xml).toMatchInlineSnapshot(
        // eslint-disable-next-line max-len
        '"<?xml version=\\"1.0\\"?><methodCall><methodName>myMethodName</methodName><params><param><value><string>test</string></value></param></params></methodCall>"'
      );
    });

    it('it should format a number parameter correctly', () => {
      const xml = serializeMethodCall('myMethodName', [1]);
      expect(xml).toMatchInlineSnapshot(
        // eslint-disable-next-line max-len
        '"<?xml version=\\"1.0\\"?><methodCall><methodName>myMethodName</methodName><params><param><value><int>1</int></value></param></params></methodCall>"'
      );
    });

    it('it should format a complex parameter list correctly', () => {
      const xml = serializeMethodCall('myMethodName', [
        1,
        'another',
        'parameter',
        4
      ]);
      expect(xml).toMatchInlineSnapshot(
        // eslint-disable-next-line max-len
        '"<?xml version=\\"1.0\\"?><methodCall><methodName>myMethodName</methodName><params><param><value><int>1</int></value></param><param><value><string>another</string></value></param><param><value><string>parameter</string></value></param><param><value><int>4</int></value></param></params></methodCall>"'
      );
    });

    it('it should format an array parameter correctly', () => {
      const xml = serializeMethodCall('myMethodName', [[1, 2, 3]]);
      expect(xml).toMatchInlineSnapshot(
        // eslint-disable-next-line max-len
        '"<?xml version=\\"1.0\\"?><methodCall><methodName>myMethodName</methodName><params><param><value><array><data><value><int>1</int></value><value><int>2</int></value><value><int>3</int></value></data></array></value></param></params></methodCall>"'
      );
    });

    it('it should format a struct parameter correctly', () => {
      const xml = serializeMethodCall('myMethodName', [
        { test: 123, foo: { bar: 'baz' } }
      ]);
      expect(xml).toMatchInlineSnapshot(
        // eslint-disable-next-line max-len
        '"<?xml version=\\"1.0\\"?><methodCall><methodName>myMethodName</methodName><params><param><value><struct><member><name>test</name><value><int>123</int></value></member><member><name>foo</name><value><struct><member><name>bar</name><value><string>baz</string></value></member></struct></value></member></struct></value></param></params></methodCall>"'
      );
    });
  });
});
