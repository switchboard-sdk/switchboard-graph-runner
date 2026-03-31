export interface SBProperty {
  name: string;
  type: 'float' | 'int' | 'string' | 'bool';
  value: any;
  default: any;
  description?: string;
  readOnly: boolean;
  min?: number;
  max?: number;
  options?: string[];
}
