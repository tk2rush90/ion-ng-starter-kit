import { Inject, Injectable, DOCUMENT } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class HrefLangService {
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  addOrUpdate(href: string, lang: string): void {
    let link = this.document.querySelector(
      `link[rel="alternate"][href="${href}"][hreflang="${lang}"]`,
    );

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');

      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
    link.setAttribute('hreflang', lang);
  }
}
