import { Component, computed, input, viewChild } from '@angular/core';
import { ImageHandlerDirective } from '../image-handler/image-handler.directive';
import { NgClass } from '@angular/common';
import { ImageOffIcon, LucideAngularModule } from 'lucide-angular';
import { fadeInOut } from '../../../animations/fade-in-out';

@Component({
  selector: 'app-image',
  imports: [ImageHandlerDirective, NgClass, LucideAngularModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  host: {
    '[class]': `classes()`,
    class: 'overflow-hidden block',
  },
  animations: [fadeInOut()],
})
export class ImageComponent {
  src = input.required<any>();

  classes = computed(() => {
    const imageLoaded = this.imageHandlerDirective()?.imageLoaded();

    return {
      'bg-black/5': !imageLoaded,
      'dark:bg-white/10': !imageLoaded,
    };
  });

  imageClasses = computed(() => {
    const imageError = this.imageHandlerDirective()?.imageError();

    return {
      hidden: imageError,
    };
  });

  imageHandlerDirective = viewChild(ImageHandlerDirective);
  protected readonly ImageOffIcon = ImageOffIcon;
}
