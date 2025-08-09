import { Insets } from '../data/insets';
import { registerPlugin } from '@capacitor/core';

export interface DeviceInsetsPlugin {
  getInsets(): Promise<Insets>;
}

export const DeviceInsets = registerPlugin<DeviceInsetsPlugin>('DeviceInsets');
