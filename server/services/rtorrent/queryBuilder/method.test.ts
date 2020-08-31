import { Command, MultiCommand, MethodTypes } from './methods';
import { Attributes } from './attributes/d_commands';
import { mocked } from 'ts-jest/utils';

import { methodCall } from '../';

jest.mock('../');

describe('MethodCall', () => {
  beforeAll(() => {
    const mockedMethodCall = mocked(methodCall, true);
    mockedMethodCall.mockImplementation(async (_xml: string) => {
      return await Promise.resolve(0);
    });
  });

  it('should send a valid command to rtorrent', async () => {
    const command = new MultiCommand();

    const multiCall = new Command(MethodTypes.dmulticall);
    multiCall.addParameter('');
    multiCall.addParameter('main');

    multiCall.addParameter(Attributes.name);

    command.addCommand(multiCall);

    const response = await methodCall(command.serializeMethod());
    expect(response).toBe(0);
  });
});
