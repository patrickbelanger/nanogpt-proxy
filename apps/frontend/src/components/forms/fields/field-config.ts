import type { FieldType } from './field-type.ts';

export type FieldConfig<T, K extends keyof T = keyof T> = {
  key: K;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  validate?: (value: T[K], values: T) => string | null;
};
