import { registerPlugin } from '@capacitor/core';
import { CheckForUpdateResultDto } from '../dto/check-for-update-result-dto';

export interface GoogleAppUpdatePlugin {
  checkForUpdate(): Promise<CheckForUpdateResultDto>;
}

export const GoogleAppUpdate =
  registerPlugin<GoogleAppUpdatePlugin>('GoogleAppUpdate');
