import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BinanceExchangeInfoDataService } from './binance-exchange-info-data.service';
import { BinanceExchangeInfoData } from './binance-exchange-info-data';
import { TradingPair } from './trading-pair';

describe('BinanceExchangeInfoDataService', () => {
  let service: BinanceExchangeInfoDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BinanceExchangeInfoDataService],
    });

    service = TestBed.inject(BinanceExchangeInfoDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should call the correct API and return data', () => {
    const mockResponse: BinanceExchangeInfoData = {
      symbols: [
        {
          symbol: 'BTCUSDT',
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
        },
      ] as TradingPair[],
    };

    service.fetchData$().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://api.binance.com/api/v3/exchangeInfo');

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
