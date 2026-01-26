import { RPCClient } from './RPCClient';

export class SwitchboardClient {
  rpcClient: RPCClient;

  constructor() {
    this.rpcClient = new RPCClient();
  }

  getValue(objectUri: string, key: string): object {
    const method = "getValue";
    const params = {
      objectURI: objectUri,
      key: key
    }
    const response = this.rpcClient.sendCommand(method, params);
    const responseObj = JSON.parse(response);
    return responseObj;
  }

  setValue(objectUri: string, key: string, value: any): object {
    const method = "setValue";
    const params = {
      objectURI: objectUri,
      key: key,
      value: value
    }
    const response = this.rpcClient.sendCommand(method, params);
    const responseObj = JSON.parse(response);
    return responseObj;
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

  addEventListener(objectUri: string, eventName: string): object {
    const method = "addEventListener";
    const params = {
      objectURI: objectUri,
      eventName: eventName
    }
    const response = this.rpcClient.sendCommand(method, params);
    const responseObj = JSON.parse(response);
    return responseObj;
  }
}
