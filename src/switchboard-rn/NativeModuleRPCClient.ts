import { EventSubscription } from 'react-native';
import SwitchboardTurboModule from '../../specs/NativeSwitchboardModule';
import { RPCClient } from '../switchboard-api/RPCClient';

/**
 * React Native implementation of the RPCClient interface.
 *
 * This class provides RPC communication with the Switchboard SDK through
 * React Native's native module bridge (Turbo Modules). It implements the
 * JSON-RPC 2.0 protocol for command execution and event handling.
 *
 * @example
 * ```typescript
 * const rpcClient = new NativeModuleRPCClient();
 * rpcClient.setEventReceivedCallback((event) => {
 *   console.log('Received event:', event);
 * });
 * const response = rpcClient.sendCommand('getValue', { objectURI: 'test', key: 'value' });
 * ```
 */
export class NativeModuleRPCClient implements RPCClient {
  /** Counter for generating unique command IDs for JSON-RPC requests */
  nextCommandId: number;

  /** Optional callback function to handle incoming events from the native module */
  eventReceivedCallback?: (data: string) => void;

  /** React Native event subscription for native module events */
  eventSubscription?: EventSubscription | null;

  /**
   * Creates a new NativeModuleRPCClient instance.
   * Initializes the command ID counter to 0.
   */
  constructor() {
    this.nextCommandId = 0;
  }

  /**
   * Sets a callback to handle events received from the Switchboard SDK.
   *
   * This method sets up a subscription to the native module's event emitter.
   * When events are received from the native side, they are forwarded to the
   * provided callback. If a callback was previously set, the old subscription
   * is cleaned up before establishing a new one.
   *
   * @param callback - Function to call when events are received. Receives event data as JSON string.
   *
   * @example
   * ```typescript
   * rpcClient.setEventReceivedCallback((eventJSON) => {
   *   const event = JSON.parse(eventJSON);
   *   console.log('Event:', event.type, event.data);
   * });
   * ```
   */
  setEventReceivedCallback(callback: (data: string) => void): void {
    // Clean up existing subscription if any
    if (this.eventSubscription) {
      this.eventSubscription.remove();
      this.eventSubscription = null;
    }

    this.eventReceivedCallback = callback;

    // Set up subscription to native module events
    this.eventSubscription = SwitchboardTurboModule?.onEventReceived((eventJSON: string) => {
      if (this.eventReceivedCallback) {
        this.eventReceivedCallback(eventJSON);
      }
    });
  }

  /**
   * Sends a JSON-RPC 2.0 command to the Switchboard SDK through the native module.
   *
   * This method constructs a JSON-RPC request with a unique ID, serializes it,
   * and sends it to the native module for processing. The response is returned
   * synchronously as a JSON string.
   *
   * @param method - The RPC method name to invoke (e.g., 'getValue', 'callAction')
   * @param params - The parameters object to pass with the RPC call
   * @returns The JSON-RPC response string from the native module
   *
   * @example
   * ```typescript
   * const response = rpcClient.sendCommand('getValue', {
   *   objectURI: 'inputNode',
   *   key: 'isMuted'
   * });
   * const result = JSON.parse(response);
   * console.log('Value:', result.result);
   * ```
   */
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
