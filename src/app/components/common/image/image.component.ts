import { Component, Input, ViewChild } from '@angular/core';
import { ImageLoaderDirective } from '../image-loader/image-loader.directive';

@Component({
  selector: 'app-image',
  imports: [ImageLoaderDirective],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  host: {
    class: 'relative block overflow-hidden',
    '[class.bg-gray-100]': `imageLoader ? !imageLoader.imageLoaded : true`,
  },
})
export class ImageComponent {
  @Input() src?: string | null = '';

  @Input() alt = '';

  @ViewChild(ImageLoaderDirective) imageLoader?: ImageLoaderDirective;
}
