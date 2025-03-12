import { Inject, Injectable, NgZone } from '@angular/core';
import { isBrowser } from '../../../utils/platform';
import { io, Socket } from 'socket.io-client';
import { SOCKET_CONNECTION_URI } from '../../../tokens/socket-connection-uri';

/** Socket service */
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  /** Map of listeners by event name. The key is `eventName` */
  private listenersMap: Map<string, (payload: any) => void> = new Map();

  /** Socket client */
  private socket?: Socket;

  constructor(
    @Inject(SOCKET_CONNECTION_URI) private readonly uri: string,
    private readonly ngZone: NgZone,
  ) {
    if (isBrowser()) {
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
    if (isBrowser()) {
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
    if (isBrowser()) {
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
    if (isBrowser()) {
      this.socket?.emit(eventName, ...payload);
    }
  }
}
