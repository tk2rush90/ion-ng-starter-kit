import { EmailRequestDto } from './email-request-dto';
import { NicknameRequestDto } from './nickname-request-dto';

export interface JoinRequestDto extends EmailRequestDto, NicknameRequestDto {}
