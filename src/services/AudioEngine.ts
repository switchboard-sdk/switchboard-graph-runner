import { SwitchboardClient } from './SwitchboardClient';

export class AudioEngine {
  switchboardClient: SwitchboardClient;

  constructor(switchboardClient: SwitchboardClient) {
    this.switchboardClient = switchboardClient;

    const addEventListenerResult = this.switchboardClient.addEventListener("*", "*");
    console.log("Added event listener result:", addEventListenerResult);
  }

  initialize(appID: string, appSecret: string): object {
    const objectUri = "switchboard";
    const actionName = "initialize";
    const data = {
      appID: appID,
      appSecret: appSecret,
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

  stopEngine(engineId: string): object {
    const objectUri = `${engineId}`;
    const actionName = "stop";
    const data = {};
    const response = this.switchboardClient.callAction(objectUri, actionName, data);
    return response;
  }

  muteMicrophone(): object {
    const objectUri = `inputNode`;
    const key = "isMuted";
    const value = true;
    const response = this.switchboardClient.setValue(objectUri, key, value);
    return response;
  }

  unmuteMicrophone(): object {
    const objectUri = `inputNode`;
    const key = "isMuted";
    const value = false;
    const response = this.switchboardClient.setValue(objectUri, key, value);
    return response;
  }

}
