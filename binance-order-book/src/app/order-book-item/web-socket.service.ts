import { EnvironmentInjector, inject, Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class WebSocketService {
  private socket: WebSocket | null = null;
  private subject: Subject<string> = new Subject();
  private injector = inject(EnvironmentInjector);
  private _loading = signal(false);

  public get loading$() {
    return toObservable(this._loading, { injector: this.injector });
  }

  constructor() {
  }

  public connect(url: string): void {
    if (this.socket) {
      this.socket.close();
    }
    this._loading.set(true);
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event: MessageEvent) => {
      this._loading.set(false);
      this.subject.next(event.data);
    };

    this.socket.onerror = (error: Event) => {
      this._loading.set(false);
      this.subject.error(error);
    };

    this.socket.onclose = () => {
      this.subject.complete();
    };
  }

  public get messages$(): Observable<string> {
    return this.subject.asObservable();
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
