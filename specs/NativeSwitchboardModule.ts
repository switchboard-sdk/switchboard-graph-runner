import {TurboModule, TurboModuleRegistry, CodegenTypes} from 'react-native';

export interface Spec extends TurboModule {
  readonly processCommand: (input: string) => string;
  readonly onEventReceived: CodegenTypes.EventEmitter<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeSwitchboardModule',
);