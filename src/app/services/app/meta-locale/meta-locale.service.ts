import { Injectable } from '@angular/core';
import { MetaService } from '../meta/meta.service';

@Injectable({
  providedIn: 'root',
})
export class MetaLocaleService extends MetaService {
  constructor() {
    super();
  }

  setLocale(value: string): void {
    const ogLocale = this.get('property', 'og:locale');

    ogLocale.setAttribute('content', value);
  }
}
