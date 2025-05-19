import { WallSimpleDto } from './wall-simple-dto';

export interface PostSimpleDto {
  id: string;
  title: string;
  wall: WallSimpleDto;
}
