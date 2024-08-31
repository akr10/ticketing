declare module 'mongoose-update-if-current' {
  import { Schema } from 'mongoose';

  interface UpdateIfCurrentOptions {
    strategy?: 'timestamp';
  }

  export function plugin(schema: Schema, options?: UpdateIfCurrentOptions): void;

  export default function updateIfCurrent(schema: Schema): void;
}