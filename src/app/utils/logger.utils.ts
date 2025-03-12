import { isDevMode } from '@angular/core';

/** A class to create log in console only for DevMode */
export class Logger {
  constructor(private readonly context: string) {}

  /**
   * Wrapper method of `console.log()`.
   * @param data - Any data.
   */
  log(...data: any): void {
    if (isDevMode()) {
      this.startGroup();
      console.log(...data);
      this.endGroup();
    }
  }

  /**
   * Wrapper method of `console.info()`.
   * @param data - Any data.
   */
  info(...data: any): void {
    if (isDevMode()) {
      this.startGroup();
      console.info(...data);
      this.endGroup();
    }
  }

  /**
   * Wrapper method of `console.debug()`.
   * @param data - Any data.
   */
  debug(...data: any): void {
    if (isDevMode()) {
      this.startGroup();
      console.debug(...data);
      this.endGroup();
    }
  }

  /**
   * Wrapper method of `console.warn()`.
   * @param data - Any data.
   */
  warn(...data: any): void {
    if (isDevMode()) {
      this.startGroup();
      console.warn(...data);
      this.endGroup();
    }
  }

  /**
   * Wrapper method of `console.error()`.
   * @param data - Any data.
   */
  error(...data: any): void {
    if (isDevMode()) {
      this.startGroup();
      console.error(...data);
      this.endGroup();
    }
  }

  /** Start log grouping. It starts group when `context` is set */
  private startGroup(): void {
    if (this.context) {
      console.group(this.context);
    }
  }

  /** End log grouping. It ends group when `context` is set */
  private endGroup(): void {
    if (this.context) {
      console.groupEnd();
    }
  }
}
