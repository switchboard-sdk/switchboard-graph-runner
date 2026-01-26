import { RPCClient } from './RPCClient';

/**
 * Client for interacting with the Switchboard SDK API.
 *
 * This class provides a high-level interface for communicating with Switchboard
 * objects through an RPC client. It abstracts the JSON-RPC protocol details and
 * provides typed methods for common operations like getting/setting values,
 * calling actions, and managing event listeners.
 */
export class SwitchboardClient {
  /** The underlying RPC client used for communication */
  rpcClient: RPCClient;

  /**
   * Creates a new SwitchboardClient instance.
   *
   * @param rpcClient - The RPC client implementation to use for communication
   */
  constructor(rpcClient: RPCClient) {
    this.rpcClient = rpcClient;
  }

  /**
   * Retrieves a value from a Switchboard object.
   *
   * @param objectUri - The URI identifier of the Switchboard object
   * @param key - The property key to retrieve
   * @returns The JSON-RPC response containing the requested value
   *
   * @example
   * ```typescript
   * const response = client.getValue('inputNode', 'isMuted');
   * console.log(response.result);
   * ```
   */
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

  /**
   * Sets a value on a Switchboard object.
   *
   * @param objectUri - The URI identifier of the Switchboard object
   * @param key - The property key to set
   * @param value - The value to assign to the property
   * @returns The JSON-RPC response confirming the operation
   *
   * @example
   * ```typescript
   * const response = client.setValue('inputNode', 'isMuted', true);
   * ```
   */
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

  /**
   * Invokes an action on a Switchboard object.
   *
   * Actions are operations that can be performed on Switchboard objects,
   * such as starting/stopping an engine or initializing the SDK.
   *
   * @param objectUri - The URI identifier of the Switchboard object
   * @param action - The name of the action to invoke
   * @param data - The parameters to pass to the action
   * @returns The JSON-RPC response containing the action result
   *
   * @example
   * ```typescript
   * const response = client.callAction('switchboard', 'initialize', {
   *   appID: 'your-app-id',
   *   appSecret: 'your-app-secret'
   * });
   * ```
   */
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

  /**
   * Registers an event listener for a Switchboard object.
   *
   * Events from the specified object will be delivered through the RPC client's
   * event callback. Use "*" as the object URI and/or event name to listen to
   * all objects or all events.
   *
   * @param objectUri - The URI of the object to listen to, or "*" for all objects
   * @param eventName - The name of the event to listen for, or "*" for all events
   * @returns The JSON-RPC response containing the listener registration result
   *
   * @example
   * ```typescript
   * // Listen to all events from all objects
   * client.addEventListener('*', '*');
   *
   * // Listen to specific event from specific object
   * client.addEventListener('engine123', 'stateChanged');
   * ```
   */
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

  /**
   * Removes a previously registered event listener.
   *
   * @param objectUri - The URI of the object the listener is attached to
   * @param listenerID - The ID of the listener to remove (returned from addEventListener)
   * @returns The JSON-RPC response confirming the removal
   *
   * @example
   * ```typescript
   * const addResponse = client.addEventListener('*', '*');
   * const listenerId = addResponse.result.listenerID;
   *
   * // Later, remove the listener
   * client.removeEventListener('*', listenerId);
   * ```
   */
  removeEventListener(objectUri: string, listenerID: number): object {
    const method = "removeEventListener";
    const params = {
      objectURI: objectUri,
      listenerID: listenerID
    }
    const response = this.rpcClient.sendCommand(method, params);
    const responseObj = JSON.parse(response);
    return responseObj;
  }
}
