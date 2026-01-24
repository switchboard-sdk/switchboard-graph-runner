import SwitchboardTurboModule from '../../specs/NativeSwitchboardModule';

export class RPCClient {
  nextCommandId: number;

  constructor() {
    this.nextCommandId = 0;
  }

  sendCommand(method: string, params: object): string {
    const commandId = ++this.nextCommandId;
    const rpcCommand = {
      jsonrpc: "2.0",
      id: commandId,
      method: method,
      params: params
    }
    const commandString = JSON.stringify(rpcCommand);
    const response = SwitchboardTurboModule.processCommand(commandString);
    return response;
  }
}
