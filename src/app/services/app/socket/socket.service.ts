import { inject, Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { SOCKET_CONNECTION_URI } from '../../../tokens/socket-connection-uri';
import { AngularPlatformService } from '../angular-platform/angular-platform.service';

/** Socket service */
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  /** Map of listeners by event name. The key is `eventName` */
  private listenersMap: Map<string, (payload: any) => void> = new Map();

  /** Socket client */
  private socket?: Socket;

  private readonly uri = inject<string>(SOCKET_CONNECTION_URI);

  private readonly ngZone = inject(NgZone);

  private readonly angularPlatformService = inject(AngularPlatformService);

  constructor() {
    if (this.angularPlatformService) {
      this.ngZone.runOutsideAngular(() => {
        this.socket = io(this.uri, {
          closeOnBeforeunload: true,
          autoConnect: true,
        });
      });
    }
  }

  /**
   * Start listening for `eventName`.
   * @param eventName - Event name.
   * @param listener - Listener to be called on event triggered.
   */
  on(eventName: string, listener: (...payload: any) => void): void {
    if (this.angularPlatformService.isPlatformBrowser()) {
      // Switch on event.
      this.socket?.on(eventName, listener);

      // Add to map.
      this.listenersMap.set(eventName, listener);
    }
  }

  /**
   * Stop listening for `eventName`.
   * @param eventName - Event name.
   */
  off(eventName: string): void {
    if (this.angularPlatformService.isPlatformBrowser()) {
      // Switch off event.
      this.socket?.off(eventName, this.listenersMap.get(eventName));

      // Remove from map.
      this.listenersMap.delete(eventName);
    }
  }

  /**
   * Emit event to server.
   * @param eventName - Event name.
   * @param payload - Any payload to pass.
   */
  emit(eventName: string, ...payload: any): void {
    if (this.angularPlatformService.isPlatformBrowser()) {
      this.socket?.emit(eventName, ...payload);
    }
  }
}
