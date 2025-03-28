import { EnvironmentInjector, inject, Injectable, signal } from '@angular/core';
import { BinanceExchangeInfoDataService } from '../data/binance-exchange-info-data.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { BinanceExchangeInfoData } from '../data/binance-exchange-info-data';
import { TradingPair } from '../data/trading-pair';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable()
export class OrderBookMenuService {
  private _binanceExchangeInfoData = signal<BinanceExchangeInfoData | null>(null);
  private _loading = signal(false);
  private injector = inject(EnvironmentInjector);

  constructor(private binanceExchangeInfoDataService: BinanceExchangeInfoDataService) {
  }

  public get binanceExchangeInfoData$() {
    return toObservable(this._binanceExchangeInfoData, { injector: this.injector });
  }

  public get loading$() {
    return toObservable(this._loading, { injector: this.injector });
  }

  public getTradingPairsUSDT$(): Observable<TradingPair[] | null> {
    const quoteAssetUSDT = 'USDT';

    return this.getTradingPairs$().pipe(
      map((pairs: TradingPair[] | null) =>
        pairs?.filter(({ isSpotTradingAllowed, quoteAsset }) => isSpotTradingAllowed && quoteAsset === quoteAssetUSDT) || null,
      ),
    );
  }

  public getTradingPairs$(): Observable<TradingPair[] | null> {
    return this.fetchExchangeInfo$().pipe(
      map((fetchExchange: BinanceExchangeInfoData | null) => fetchExchange?.symbols || null),
    );
  }

  public fetchExchangeInfo$(): Observable<BinanceExchangeInfoData | null> {
    return this.binanceExchangeInfoData$.pipe(
      switchMap((data: BinanceExchangeInfoData | null) =>
        data ? of(data) : this.fetchAndCacheExchangeInfo$(),
      ),
    );
  }

  public fetchAndCacheExchangeInfo$(): Observable<BinanceExchangeInfoData | null> {
    this._loading.set(true);

    return this.binanceExchangeInfoDataService.fetchData$().pipe(
      tap((data: BinanceExchangeInfoData) => this._binanceExchangeInfoData.set(data)),
      catchError(() => {
        console.error('Error fetching data');

        return of(null);
      }),
      finalize(() => this._loading.set(false)),
    );
  }
}
