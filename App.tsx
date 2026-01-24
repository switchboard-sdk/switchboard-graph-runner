import React from 'react';
import {
  Alert,
  EventSubscription,
  Button,
  SafeAreaView,
  ScrollView,
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
  const [engineId, setEngineId] = React.useState<string | null>(null);
  const [isEngineRunning, setIsEngineRunning] = React.useState(false);
  const listenerSubscription = React.useRef<null | EventSubscription>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const log = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const timeText = `[${timestamp}]`;
    setLogText(prevLogText => prevLogText + "\n " + timeText + " " + text);
  }

  const logResult = (result: object) => {
    const resultText = JSON.stringify(result, null, 2);
    log(resultText);
  }

  const onToggleEnginePress = () => {
    if (!engineId) {
      log('Engine not initialized yet');
      return;
    }

    if (isEngineRunning) {
      log('Stopping engine...');
      const result = audioEngine.stopEngine(engineId);
      logResult(result);
      setIsEngineRunning(false);
    } else {
      log('Starting engine...');
      const result = audioEngine.startEngine(engineId);
      logResult(result);
      setIsEngineRunning(true);
    }
  };

  console.log("The app is rendering");

  React.useEffect(() => {
    listenerSubscription.current = SwitchboardTurboModule?.onEventReceived((eventJSON) => Alert.alert(`Event triggered: ${eventJSON}`));

    // Initialize and create engine on app start
    log('Initializing Switchboard...');
    const initResult = audioEngine.initialize();
    logResult(initResult);
    log('Creating audio engine...');
    const result2 = audioEngine.createEngine(engine);
    logResult(result2);
    const createdEngineId = (result2 as any).result;
    setEngineId(createdEngineId);

    return  () => {
      listenerSubscription.current?.remove();
      listenerSubscription.current = null;
    }
  }, [])

  React.useEffect(() => {
    if (logText && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Switchboard Graph Runner
        </Text>
        <Button
          title={isEngineRunning ? "Stop Engine" : "Start Engine"}
          onPress={onToggleEnginePress}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.logContainer}
        contentContainerStyle={styles.logContent}>
        <Text style={styles.logText}>{logText}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  logContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logContent: {
    padding: 16,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 12,
  }
});

export default App;