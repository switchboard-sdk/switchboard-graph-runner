import React from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as engine from './engine.json';
import { AudioEngine } from './src/AudioEngine';
import { NodePanel } from './src/components/NodePanel';
import { SwitchboardClient } from './src/switchboard-api/SwitchboardClient';
import { NativeModuleRPCClient } from './src/switchboard-rn/NativeModuleRPCClient';
import { SWITCHBOARD_APP_ID, SWITCHBOARD_APP_SECRET } from './src/Config';

const rpcClient = new NativeModuleRPCClient();
const switchboardClient = new SwitchboardClient(rpcClient);
const audioEngine = new AudioEngine(switchboardClient);

function App(): React.JSX.Element {
  const [logText, setLogText] = React.useState('');
  const [engineId, setEngineId] = React.useState<string | null>(null);
  const [isEngineRunning, setIsEngineRunning] = React.useState(false);
  const [isMicMuted, setIsMicMuted] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const log = React.useCallback((text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogText(prev => prev + '\n ' + `[${timestamp}]` + ' ' + text);
  }, []);

  const logResult = React.useCallback(
    (result: object) => log(JSON.stringify(result, null, 2)),
    [log],
  );

  const onToggleEnginePress = async () => {
    if (!engineId) { log('Engine not initialized yet'); return; }

    if (isEngineRunning) {
      log('Stopping engine...');
      logResult(audioEngine.stopEngine(engineId));
      setIsEngineRunning(false);
    } else {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          log('Microphone permission denied');
          return;
        }
      }
      log('Starting engine...');
      logResult(audioEngine.startEngine(engineId));
      setIsEngineRunning(true);
    }
  };

  const onToggleMicMutePress = () => {
    if (isMicMuted) {
      logResult(audioEngine.unmuteMicrophone());
      setIsMicMuted(false);
    } else {
      logResult(audioEngine.muteMicrophone());
      setIsMicMuted(true);
    }
  };

  React.useEffect(() => {
    rpcClient.setEventReceivedCallback((eventJSON: string) => {
      log(`Event received: ${eventJSON}`);
    });

    log('Initializing Switchboard...');
    logResult(audioEngine.initialize(SWITCHBOARD_APP_ID, SWITCHBOARD_APP_SECRET));

    log('Creating audio engine...');
    const createResult = audioEngine.createEngine(engine);
    logResult(createResult);
    setEngineId((createResult as any).result);
  }, [log, logResult]);

  React.useEffect(() => {
    if (logText && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logText]);

  const graphNodes: { id: string }[] = engine.configuration?.graph?.nodes ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Switchboard Graph Runner</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={isEngineRunning ? 'Stop Engine' : 'Start Engine'}
            onPress={onToggleEnginePress}
          />
          <Button
            title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            onPress={onToggleMicMutePress}
          />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {engineId && graphNodes.map(node => (
          <NodePanel key={node.id} nodeId={node.id} client={switchboardClient} />
        ))}

        <View style={styles.logContainer}>
          <Text style={styles.logHeader}>Log</Text>
          <ScrollView
            ref={scrollViewRef}
            nestedScrollEnabled
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
            <Text style={styles.logText}>{logText}</Text>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  logContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    margin: 12,
    padding: 12,
    minHeight: 160,
  },
  logHeader: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#d4d4d4',
  },
});

export default App;
