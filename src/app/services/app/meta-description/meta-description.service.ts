import { Injectable } from '@angular/core';
import { MetaService } from '../meta/meta.service';

/** description 메타 태그 관리를 위한 서비스 */
@Injectable({
  providedIn: 'root',
})
export class MetaDescriptionService extends MetaService {
  constructor() {
    super();
  }

  setDescription(value: string): void {
    const description = this.get('name', 'description');
    const ogDescription = this.get('property', 'og:description');
    const twitterDescription = this.get('name', 'twitter:description');

    description.setAttribute('content', value);
    ogDescription.setAttribute('content', value);
    twitterDescription.setAttribute('content', value);
  }
}
