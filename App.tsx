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

function App(): React.JSX.Element {
  const [value, setValue] = React.useState('');
  const [reversedValue, setReversedValue] = React.useState('');
  const listenerSubscription = React.useRef<null | EventSubscription>(null);

  const onPress = () => {
    const revString = SwitchboardTurboModule.processCommand(value);
    setReversedValue(revString);
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
          Welcome to C++ Turbo Native Module Example
        </Text>
        <Text>Write down here the text you want to reverse</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Write your text here"
          onChangeText={setValue}
          value={value}
        />
        <Button title="Reverse" onPress={onPress} />
        <Text>Reversed text: {reversedValue}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});

export default App;