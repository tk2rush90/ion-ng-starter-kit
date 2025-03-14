import { EmailRequestDto } from './email-request-dto';

export interface LoginRequestDto extends EmailRequestDto {
  otp: string;
}
