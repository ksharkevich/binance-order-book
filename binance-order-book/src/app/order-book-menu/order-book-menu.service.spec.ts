import { TestBed } from '@angular/core/testing';
import { OrderBookMenuService } from './order-book-menu.service';
import { BinanceExchangeInfoDataService } from '../data/binance-exchange-info-data.service';
import { TradingPair } from '../data/trading-pair';
import { instance, mock, when } from 'ts-mockito';
import { of, take } from 'rxjs';

describe('OrderBookMenuService', () => {
  let service: OrderBookMenuService;
  let binanceServiceMock: BinanceExchangeInfoDataService;

  beforeEach(() => {
    binanceServiceMock = mock(BinanceExchangeInfoDataService);

    TestBed.configureTestingModule({
      providers: [
        OrderBookMenuService,
        { provide: BinanceExchangeInfoDataService, useValue: instance(binanceServiceMock) },
      ],
    });

    service = TestBed.inject(OrderBookMenuService);
  });

  it('should properly handle loading state', (done) => {
    service.loading$.subscribe((loading) => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should filter trading pairs with USDT', (done) => {
    const tradingPairs: TradingPair[] = [
      { symbol: 'BTCUSDT', isSpotTradingAllowed: true, quoteAsset: 'USDT' },
      { symbol: 'ETHUSDT', isSpotTradingAllowed: true, quoteAsset: 'USDT' },
      { symbol: 'BNBBTC', isSpotTradingAllowed: true, quoteAsset: 'BTC' },
    ];

    when(binanceServiceMock.fetchData$()).thenReturn(of({ symbols: tradingPairs }));

    service.getTradingPairsUSDT$().pipe(take(1)).subscribe((filteredPairs) => {
      expect(filteredPairs).toEqual(([
        { symbol: 'BTCUSDT', isSpotTradingAllowed: true, quoteAsset: 'USDT' },
        { symbol: 'ETHUSDT', isSpotTradingAllowed: true, quoteAsset: 'USDT' },
      ]));
      done();
    });
  });
});
