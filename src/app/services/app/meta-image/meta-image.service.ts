import { Injectable } from '@angular/core';
import { MetaService } from '../meta/meta.service';

@Injectable({
  providedIn: 'root',
})
export class MetaImageService extends MetaService {
  constructor() {
    super();
  }

  setImage(value: string): void {
    const ogImage = this.get('property', 'og:image');
    const twitterImage = this.get('name', 'twitter:image');

    ogImage.setAttribute('content', value);
    twitterImage.setAttribute('content', value);
  }
}
