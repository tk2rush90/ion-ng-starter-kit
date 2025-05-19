import { booleanAttribute, Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input({ required: true }) avatar = '';

  @Input({ required: true }) color = '';

  @Input({ transform: booleanAttribute }) useSilhouette = false;

  get imageUrl(): string {
    if (this.useSilhouette) {
      return `/assets/images/${this.avatar}-Silhouette.svg`;
    } else {
      return `/assets/images/${this.avatar}.svg`;
    }
  }
}
