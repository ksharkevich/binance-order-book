import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderBookMenuComponent } from './order-book-menu.component';
import { OrderBookMenuService } from './order-book-menu.service';
import { BinanceExchangeInfoDataService } from '../data/binance-exchange-info-data.service';
import { TradingPair } from '../data/trading-pair';
import { instance, mock, when } from 'ts-mockito';
import { Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderBookMenuComponent', () => {
  let component: OrderBookMenuComponent;
  let fixture: ComponentFixture<OrderBookMenuComponent>;
  let menuServiceMock: OrderBookMenuService;
  let exchangeServiceMock: BinanceExchangeInfoDataService;
  let tradingPairsSubject: Subject<TradingPair[]>;
  let loadingSubject: Subject<boolean>;

  beforeEach(async () => {
    menuServiceMock = mock(OrderBookMenuService);
    exchangeServiceMock = mock(BinanceExchangeInfoDataService);
    tradingPairsSubject = new Subject<TradingPair[]>();
    loadingSubject = new Subject<boolean>();

    when(menuServiceMock.getTradingPairsUSDT$()).thenReturn(tradingPairsSubject.asObservable());
    when(menuServiceMock.loading$).thenReturn(loadingSubject.asObservable());

    await TestBed.configureTestingModule({
      providers: [
        { provide: OrderBookMenuService, useValue: instance(menuServiceMock) },
        { provide: BinanceExchangeInfoDataService, useValue: instance(exchangeServiceMock) },
      ],
      imports: [OrderBookMenuComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBookMenuComponent);
    component = fixture.componentInstance;
  });

  it('should fetch trading pairs on init', () => {
    fixture.detectChanges();
    tradingPairsSubject.next([{ symbol: 'BTCUSDT' }, { symbol: 'ETHUSDT' }] as TradingPair[]);

    component.tradingPairs$.subscribe((pairs) => {
      expect(pairs?.length).toBe(2);
      expect(pairs![0].symbol).toBe('BTCUSDT');
    });
  });


  it('should add selected pairs to order book', () => {
    component.selectedPairs = [{ symbol: 'BTCUSDT' }, { symbol: 'ETHUSDT' }] as TradingPair[];
    component.selectPairs();

    expect(component.orderBookItems.length).toBe(2);
  });

  it('should remove a pair from order book', () => {
    component.orderBookItems = [{ symbol: 'BTCUSDT' }, { symbol: 'ETHUSDT' }] as TradingPair[];
    component.selectedPairs = [{ symbol: 'BTCUSDT' }, { symbol: 'ETHUSDT' }] as TradingPair[];
    component.removeOrderBook({ symbol: 'BTCUSDT' } as TradingPair);

    expect(component.orderBookItems.length).toBe(1);
    expect(component.selectedPairs.length).toBe(1);
    expect(component.orderBookItems[0].symbol).toBe('ETHUSDT');
  });
});
