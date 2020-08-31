import { serializeMethodCall } from 'xmlrpc/lib/serializer';
import Attribute from '../../../interfaces/Attribute';
import parser from './parser';

export enum MethodTypes {
  dmulticall = 'd.multicall2',
  tmulticall = 't.multicall',
  systemMulticall = 'system.multicall',
  checkHash = 'd.check_hash',
  directoryBase = 'd.directory_base',
  tryStop = 'd.try_stop',
  execute = 'execute2',
  erase = 'd.erase',
  tryStart = 'd.try_start',
  fmulticall = 'f.multicall',
  loadNormal = 'load.normal',
  loadRaw = 'load.raw_start'
}

export interface Parameter {
  param: Attribute
  expectResponse: boolean
}

// export interface Command {
//   methodName: MethodTypes
//   parameters: Parameter[]
// }

export class Command {
  parameters: Parameter[] = [];

  methodName: MethodTypes;
  constructor (methodName: MethodTypes) {
    this.methodName = methodName;
  }

  addParameter = (param: Attribute | string, expectResponse = true) => {
    if (typeof param === 'string') {
      const stringParam = { xmlName: param };
      this.parameters.push({ param: stringParam, expectResponse: false });
    } else {
      this.parameters.push({ param, expectResponse });
    }
  };

  addParameters = (params: { [key: string]: () => Attribute }) => {
    Object.values(params).forEach((param) => {
      this.parameters.push({ param: param(), expectResponse: true });
    });
  };

  getCommand = () => {
    const stringParams = this.parameters.map((param) => param.param.xmlName);
    return { methodName: this.methodName, params: stringParams };
  };

  parseResponse = (response: any) => {
    return parser(response, this.parameters);
  }

  serialize = (): string => {
    const { methodName, params } = this.getCommand();
    console.log(methodName, params);
    return serializeMethodCall(methodName, params);
  };
}

export class MultiCommand {
  commands: Command[] = [];

  methodName = MethodTypes.systemMulticall;

  addCommand = (command: Command) => {
    this.commands.push(command);
  };

  parseResponse = (response: any[]) => {
    response.map((item, idx) => {
      const command = this.commands[idx]; // These should match (hopefully)
      return parser(item, command.parameters);
    });
  }

  serializeMethod = (): string => {
    const mappedCommands = this.commands.map((command) => command.getCommand());
    return serializeMethodCall(this.methodName, [mappedCommands]);
  };
}
