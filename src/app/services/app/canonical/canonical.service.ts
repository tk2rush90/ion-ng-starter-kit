import { Inject, Injectable, DOCUMENT } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class CanonicalService {
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  addOrUpdate(href: string): void {
    let link = this.document.querySelector(`link[rel="canonical"]`);

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');

      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
  }
}
