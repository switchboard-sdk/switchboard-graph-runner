import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SwitchboardClient } from '../switchboard-api/SwitchboardClient';
import { SBProperty } from '../types/SwitchboardTypes';

interface Props {
  nodeId: string;
  property: SBProperty;
  client: SwitchboardClient;
}

export function PropertyControl({ nodeId, property, client }: Props) {
  const [value, setValue] = React.useState(property.value);

  const commit = (newValue: any) => {
    setValue(newValue);
    client.setValue(nodeId, property.name, newValue);
  };

  const label = (
    <Text style={styles.label}>{property.name}</Text>
  );

  if (property.readOnly) {
    return (
      <View style={styles.row}>
        {label}
        <Text style={styles.readOnly}>{String(value)}</Text>
      </View>
    );
  }

  if (property.type === 'bool') {
    return (
      <View style={styles.row}>
        {label}
        <Switch value={!!value} onValueChange={commit} />
      </View>
    );
  }

  if (property.type === 'string' && property.options) {
    return (
      <View style={styles.column}>
        {label}
        <View style={styles.optionRow}>
          {property.options.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.option, value === opt && styles.optionSelected]}
              onPress={() => commit(opt)}>
              <Text style={[styles.optionText, value === opt && styles.optionTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  if (property.type === 'float' || property.type === 'int') {
    const step = property.type === 'int' ? 1 : (((property.max ?? 1) - (property.min ?? 0)) / 10);
    const adjust = (delta: number) => {
      const next = Math.min(
        property.max ?? Infinity,
        Math.max(property.min ?? -Infinity, Number(value) + delta),
      );
      const rounded = property.type === 'int' ? Math.round(next) : Math.round(next * 100) / 100;
      commit(rounded);
    };
    return (
      <View style={styles.row}>
        {label}
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjust(-step)}>
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            value={String(value)}
            onEndEditing={e => {
              const parsed = parseFloat(e.nativeEvent.text);
              if (!isNaN(parsed)) commit(parsed);
            }}
          />
          <TouchableOpacity style={styles.stepBtn} onPress={() => adjust(step)}>
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // string without options
  return (
    <View style={styles.row}>
      {label}
      <TextInput
        style={styles.textInput}
        value={String(value)}
        onChangeText={setValue}
        onEndEditing={e => commit(e.nativeEvent.text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  column: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  readOnly: {
    fontSize: 13,
    color: '#888',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    minWidth: 120,
    textAlign: 'right',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    minWidth: 60,
    textAlign: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 12,
    color: '#007AFF',
  },
  optionTextSelected: {
    color: '#fff',
  },
});
