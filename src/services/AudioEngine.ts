import { SwitchboardClient } from './SwitchboardClient';

export class AudioEngine {
  switchboardClient: SwitchboardClient;

  constructor(switchboardClient: SwitchboardClient) {
    this.switchboardClient = switchboardClient;
  }

  initialize(): object {
    const objectUri = "switchboard";
    const actionName = "initialize";
    const data = {
      appID: "demo",
      appSecret: "secret",
      extensions: {
        "OpenAI": {}
      }
    }
    const response = this.switchboardClient.callAction(objectUri, actionName, data);
    return response;
  }

  createEngine(engine: object): object {
    const objectUri = "switchboard";
    const actionName = "createEngine";
    const response = this.switchboardClient.callAction(objectUri, actionName, engine);
    return response;
  }

  startEngine(engineId: string): object {
    const objectUri = `${engineId}`;
    const actionName = "start";
    const data = {};
    const response = this.switchboardClient.callAction(objectUri, actionName, data);
    return response;
  }
}
