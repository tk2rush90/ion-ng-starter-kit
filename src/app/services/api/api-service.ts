import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

/** Abstract class to create API services */
export abstract class ApiService {
  /** HttpClient */
  protected readonly _http: HttpClient = inject(HttpClient);

  /**
   * Create API service.
   * @param host - API host to be used as prefix.
   */
  protected constructor(public readonly host: string) {}
}
