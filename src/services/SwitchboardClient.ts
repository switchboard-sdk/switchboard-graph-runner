import { RPCClient } from './RPCClient';

export class SwitchboardClient {
  rpcClient: RPCClient;

  constructor() {
    this.rpcClient = new RPCClient();
  }

  callAction(objectUri: string, action: string, data: object): object {
    const method = "callAction";
    const params = {
      objectURI: objectUri,
      actionName: action,
      params: data
    }
    const response = this.rpcClient.sendCommand(method, params);
    const responseObj = JSON.parse(response);
    return responseObj;
  }
}
