/**
 * Interface for RPC (Remote Procedure Call) client implementations.
 *
 * This interface defines the contract for communication with the Switchboard SDK
 * using JSON-RPC 2.0 protocol. Implementations of this interface handle the
 * transport layer for sending commands and receiving events.
 */
export interface RPCClient {
  /**
   * Sends an RPC command to the Switchboard SDK.
   *
   * @param method - The RPC method name to invoke
   * @param params - The parameters object to pass to the method
   * @returns The JSON-RPC response as a string
   *
   * @example
   * ```typescript
   * const response = client.sendCommand('getValue', {
   *   objectURI: 'myObject',
   *   key: 'myKey'
   * });
   * ```
   */
  sendCommand(method: string, params: object): string;

  /**
   * Sets a callback to handle events received from the Switchboard SDK.
   *
   * The callback will be invoked whenever an event is received from the
   * underlying RPC transport. Only one callback can be active at a time;
   * setting a new callback will replace any existing one.
   *
   * @param callback - Function to call when events are received
   *
   * @example
   * ```typescript
   * client.setEventReceivedCallback((eventData) => {
   *   console.log('Event received:', eventData);
   * });
   * ```
   */
  setEventReceivedCallback(callback: (data: string) => void): void;
}
