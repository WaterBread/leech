import { serializeMethodCall } from '../xmlrpc';
import parser, { createError } from './queryParser';
import { methodCall } from './client';
import { Parameter, InputParameter } from './interfaces';
import { getAttributeFromString } from './utils';

// I don't like these tbh
export enum CommandTypes {
  checkHash = 'd.check_hash',
  directoryBase = 'd.directory_base',
  tryStop = 'd.stop',
  execute = 'execute2',
  erase = 'd.erase',
  tryStart = 'd.start',
  disconnectPeer = 'p.disconnect',
  loadNormal = 'load.normal',
  loadStart = 'load.start',
  loadRaw = 'load.raw_start'
}

export enum MulticallCommandTypes {
  dmulticall = 'd.multicall2',
  tmulticall = 't.multicall',
  fmulticall = 'f.multicall',
  pmulticall = 'p.multicall',

  // systemMulticall = 'system.multicall',
}

export class Command {
  parameters: Parameter[] = [];

  methodName: CommandTypes | MulticallCommandTypes;
  constructor (methodName?: CommandTypes) {
    this.methodName = methodName;
  }

  addParameter = (param: InputParameter | string, expectResponse: boolean) => {
    let parameter: Partial<InputParameter> = {};
    if (typeof param === 'string') {
      const attr = getAttributeFromString(param);

      if (attr) {
        // It has a defined attribute
        parameter = { ...attr, apiName: param };
      } else {
        // It's just a random string -- no attr
        parameter = {
          xmlName: param,
          apiName: param
        };
      }
    } else {
      parameter = param;
    }

    // At this point it should have all the required stuff
    this.parameters.push({ ...(parameter as InputParameter), expectResponse });
  };

  addParameters = (params: InputParameter[] | string[], expectResponse: boolean) => {
    params.forEach((param: string | InputParameter) => this.addParameter(param, expectResponse));
  };

  getCommand = () => {
    const stringParams = this.parameters.map((param) => param.xmlName);
    return { methodName: this.methodName, params: stringParams };
  };

  parseResponse = (response: any, isFault: boolean) => {
    if (isFault) {
      return createError(response);
    }
    return parser(response, this.parameters);
  };

  serialize = (): string => {
    const { methodName, params } = this.getCommand();
    return serializeMethodCall(methodName, params);
  };

  execute = async () => {
    const xml = this.serialize();
    const response = await methodCall(xml);
    return this.parseResponse(response.response, response.isFault);
  };
}

export class MultiCall extends Command {
  methodName: MulticallCommandTypes;
  constructor (methodType: MulticallCommandTypes) {
    super();
    this.methodName = methodType;
  }

  parseResponse = (response: any, isFault: boolean) => {
    if (isFault) {
      return createError(response);
    }
    return response.map((item) => {
      return parser(item, this.parameters);
    });
  };

  execute = async () => {
    const xml = this.serialize();
    const response = await methodCall(xml);
    return this.parseResponse(response.response, response.isFault);
  };
}

export class MultiCommand {
  commands: Command[] = [];

  methodName = 'system.multicall';

  addCommand = (command: Command) => {
    this.commands.push(command);
  };

  parseResponse = (response: any, isFault: boolean) => {
    if (isFault) {
      throw createError(response[0]);
    } else {
      return response.map((item, idx) => {
        const command = this.commands[idx]; // These should match (hopefully)
        return parser(item, command.parameters);
      });
    }
  };

  serialize = (): string => {
    const mappedCommands = this.commands.map((command) => command.getCommand());
    return serializeMethodCall(this.methodName, [mappedCommands]);
  };

  execute = async () => {
    const xml = this.serialize();
    const response = await methodCall(xml);
    return this.parseResponse(response.response, response.isFault);
  };
}
