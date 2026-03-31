import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwitchboardClient } from '../switchboard-api/SwitchboardClient';
import { SBProperty } from '../types/SwitchboardTypes';
import { PropertyControl } from './PropertyControl';

interface Props {
  nodeId: string;
  client: SwitchboardClient;
}

export function NodePanel({ nodeId, client }: Props) {
  const [properties, setProperties] = React.useState<SBProperty[]>([]);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    try {
      const response = client.callAction(nodeId, 'getProperties', {}) as any;
      const result = response?.result;
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        setProperties(Object.values(result));
      }
    } catch {
      setProperties([]);
    }
  }, [nodeId, client]);

  if (properties.length === 0 || properties.every(p => p.readOnly)) return null;

  return (
    <View style={styles.panel}>
      <TouchableOpacity style={styles.header} onPress={() => setCollapsed(c => !c)}>
        <Text style={styles.title}>{nodeId}</Text>
        <Text style={styles.chevron}>{collapsed ? '›' : '⌄'}</Text>
      </TouchableOpacity>
      {!collapsed && properties.filter(p => !p.readOnly).map(prop => (
        <PropertyControl
          key={prop.name}
          nodeId={nodeId}
          property={prop}
          client={client}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chevron: {
    fontSize: 18,
    color: '#555',
  },
});
