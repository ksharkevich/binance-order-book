import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderBookItemComponent } from './order-book-item.component';
import { WebSocketService } from './web-socket.service';
import { TradingPair } from '../data/trading-pair';
import { instance, mock, verify, when } from 'ts-mockito';
import { Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';

describe('OrderBookItemComponent', () => {
  let component: OrderBookItemComponent;
  let fixture: ComponentFixture<OrderBookItemComponent>;
  let webSocketServiceMock: WebSocketService;
  let messagesSubject: Subject<string>;
  let loadingSubject: Subject<boolean>;

  beforeEach(async () => {
    webSocketServiceMock = mock(WebSocketService);
    messagesSubject = new Subject<string>();
    loadingSubject = new Subject<boolean>();

    when(webSocketServiceMock.messages$).thenReturn(messagesSubject.asObservable());
    when(webSocketServiceMock.loading$).thenReturn(loadingSubject.asObservable());

    await TestBed.configureTestingModule({
      providers: [
        { provide: WebSocketService, useValue: instance(webSocketServiceMock) },
      ],
      imports: [OrderBookItemComponent],
    })
      .overrideComponent(OrderBookItemComponent, {
        set: { providers: [{ provide: WebSocketService, useValue: instance(webSocketServiceMock) }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrderBookItemComponent);
    component = fixture.componentInstance;
  });


  it('should connect to new WebSocket when selectedPair changes', () => {
    component.selectedPair = { symbol: 'BTCUSDT' } as TradingPair;
    fixture.detectChanges();
    component.ngOnChanges({ selectedPair: { currentValue: component.selectedPair, previousValue: null, firstChange: true, isFirstChange: () => true } });

    verify(webSocketServiceMock.connect('wss://stream.binance.com:9443/ws/btcusdt@depth5')).once();
  });

  it('should update order book when a new message is received', () => {
    const orderBookData = JSON.stringify({ lastUpdateId: 1, bids: [[50000, 1]], asks: [[51000, 2]] });

    component.selectedPair = { symbol: 'BTCUSDT' } as TradingPair;
    component.connectWebSocket();
    messagesSubject.next(orderBookData);

    expect(component.orderBook$).toBeDefined();
  });


  it('should emit remove event when removeOrderBook is called', () => {
    const removeMock = mock<EventEmitter<TradingPair>>();

    component.remove = instance(removeMock);
    component.selectedPair = { symbol: 'BTCUSDT' } as TradingPair;
    component.removeOrderBook();

    verify(removeMock.emit(component.selectedPair)).once();
  });
});
