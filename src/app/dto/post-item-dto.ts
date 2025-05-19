import { PostSimpleDto } from './post-simple-dto';
import { PostNicknameDto } from './post-nickname-dto';

export interface PostItemDto extends PostSimpleDto {
  /** ProseMirror 오브젝트를 변환한 가공되지 않은 텍스트. 최대 150자 길이. Description에 사용 */
  rawContent: string;
  nickname: PostNicknameDto;
  numberOfViewers: number;
  numberOfLikes: number;
  numberOfComments: number;
  /** 로그인 한 사용자가 좋아요 눌렀는지 여부 */
  isLiked: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
