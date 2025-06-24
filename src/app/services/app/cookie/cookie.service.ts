import { Inject, Injectable, DOCUMENT } from '@angular/core';


export interface CookieOptions {
  expires?: number;
  path: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  set(
    name: string,
    value: string,
    { expires, path, domain, secure, sameSite }: CookieOptions = { path: '/' },
  ): void {
    let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;

    if (expires) {
      const expirationDate = new Date(Date.now() + expires * 1000);

      cookieString += `; expires=${expirationDate.toUTCString()}`;
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    if (secure) {
      cookieString += `; secure`;
    }

    if (sameSite) {
      cookieString += `; SameSite=${sameSite}`;
    }

    this.document.cookie = cookieString;
  }

  get(name: string): string | null {
    const cookies = this.document.cookie.split(';');

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');

      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  delete(
    name: string,
    options: Pick<CookieOptions, 'path' | 'domain'> = { path: '/' },
  ): void {
    this.set(name, '', {
      expires: 0,
      ...options,
    });
  }

  deleteAll(): void {
    const cookies = this.document.cookie.split(';');

    for (const cookie of cookies) {
      const cookieName = cookie.trim().split('=')[0];

      this.delete(cookieName);
    }
  }
}
