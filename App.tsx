import React from 'react';
import {
  Alert,
  EventSubscription,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import SwitchboardTurboModule from './specs/NativeSwitchboardModule';
import * as engine from './engine.json';
import { AudioEngine } from './src/services/AudioEngine';
import { SwitchboardClient } from './src/services/SwitchboardClient';

const switchboardClient = new SwitchboardClient();
const audioEngine = new AudioEngine(switchboardClient);

function App(): React.JSX.Element {
  const [value, setValue] = React.useState('');
  const [logText, setLogText] = React.useState('');
  const listenerSubscription = React.useRef<null | EventSubscription>(null);

  const log = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const timeText = `[${timestamp}]`;
    setLogText(prevLogText => prevLogText + "\n " + timeText + " " + text);
  }

  const logResult = (result: object) => {
    const resultText = JSON.stringify(result, null, 2);
    log(resultText);
  }

  const onInitializePress = () => {
    const result = audioEngine.initialize();
    logResult(result);
    const result2 = audioEngine.createEngine(engine);
    logResult(result2);
    const engineId = result2.result;
    const result3 = audioEngine.startEngine(engineId);
    logResult(result3);
  };

  console.log("The app is rendering");

  React.useEffect(() => {
    listenerSubscription.current = SwitchboardTurboModule?.onEventReceived((eventJSON) => Alert.alert(`Event triggered: ${eventJSON}`));

    return  () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          Switchboard Graph Runner
        </Text>
        <Button title="Initialize" onPress={onInitializePress} />
        <Text>{logText}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  }
});

export default App;