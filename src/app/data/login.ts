import { Email } from './email';

export interface Login extends Email {
  otp: string;
}
