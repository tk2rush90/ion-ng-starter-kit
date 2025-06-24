import { inject, Injectable, DOCUMENT } from '@angular/core';


/** 메타 태그 관리 위한 기본 서비스 */
@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private readonly document = inject(DOCUMENT);

  get(attributeName: string, attributeValue: string): HTMLMetaElement {
    let meta = this.document.querySelector<HTMLMetaElement>(
      `meta[${attributeName}="${attributeValue}"]`,
    );

    if (!meta) {
      meta = this.document.createElement('meta');
      meta.setAttribute(attributeName, attributeValue);

      this.document.head.appendChild(meta);
    }

    return meta;
  }
}
