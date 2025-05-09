import { Injectable } from '@angular/core';
import { MetaService } from '../meta/meta.service';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaTitleService extends MetaService {
  constructor(private readonly title: Title) {
    super();
  }

  setTitle(value: string): void {
    this.title.setTitle(value);

    const ogTitle = this.get('property', 'og:title');
    const twitterTitle = this.get('name', 'twitter:title');

    ogTitle.setAttribute('content', value);
    twitterTitle.setAttribute('content', value);
  }
}
