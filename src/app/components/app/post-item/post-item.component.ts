import { Component, Input } from '@angular/core';
import { PostItemDto } from '../../../dto/post-item-dto';
import { IconLabelComponent } from '../icon-label/icon-label.component';
import { IconClockComponent } from '../../icons/icon-clock/icon-clock.component';
import { CreatedBeforePipe } from '../../../pipes/created-before/created-before.pipe';
import { IconMessageBubbleComponent } from '../../icons/icon-message-bubble/icon-message-bubble.component';
import { IconEyeComponent } from '../../icons/icon-eye/icon-eye.component';
import { IconHeartComponent } from '../../icons/icon-heart/icon-heart.component';

@Component({
  selector: 'app-post-item',
  imports: [
    IconLabelComponent,
    IconClockComponent,
    CreatedBeforePipe,
    IconMessageBubbleComponent,
    IconEyeComponent,
    IconHeartComponent,
  ],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.scss',
})
export class PostItemComponent {
  @Input({ required: true }) post!: PostItemDto;
}
