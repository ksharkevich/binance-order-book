import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, signal, SimpleChanges } from '@angular/core';
import { TradingPair } from '../data/trading-pair';
import { WebSocketService } from './web-socket.service';
import { AsyncPipe, NgForOf } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { OrderBook } from './order-book';
import { RoundPipe } from './round.pipe';
import { TuiButton, TuiLoader } from '@taiga-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-book-item',
  templateUrl: './order-book-item.component.html',
  styleUrl: './order-book-item.component.less',
  standalone: true,
  imports: [NgForOf, AsyncPipe, RoundPipe, TuiLoader, TuiButton],
  providers: [WebSocketService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderBookItemComponent implements OnChanges, OnDestroy {
  @Input() selectedPair!: TradingPair;
  @Output() remove = new EventEmitter<TradingPair>();

  private _orderBook = signal<OrderBook>({ lastUpdateId: 0, bids: [], asks: [] });
  private webSocketService = inject(WebSocketService);

  public orderBook$ = toObservable(this._orderBook);
  public isLoading$!: Observable<boolean>;

  ngOnChanges({ selectedPair }: SimpleChanges): void {
    if (!selectedPair?.currentValue) {
      return;
    }

    this.connectWebSocket();
  }

  public connectWebSocket(): void {
    this.isLoading$ = this.webSocketService.loading$;

    const symbol = this.selectedPair.symbol.toLowerCase();

    this.webSocketService.connect(`wss://stream.binance.com:9443/ws/${symbol}@depth5`);

    this.webSocketService.messages$.subscribe({
      next: (orderBook) => {
        const newOrderBook = JSON.parse(orderBook);

        this._orderBook.set(newOrderBook);
      },
      error: (err) => console.error('Error WebSocket:', err),
    });
  }

  public ngOnDestroy(): void {
    this.webSocketService.close();
  }

  public removeOrderBook(): void {
    this.remove.emit(this.selectedPair);
  }
}
