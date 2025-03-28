import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BinanceExchangeInfoData } from './binance-exchange-info-data';

@Injectable()
export class BinanceExchangeInfoDataService {
  constructor(private readonly httpClient: HttpClient) {}

  public fetchData$(): Observable<BinanceExchangeInfoData> {
    return this.httpClient.get<BinanceExchangeInfoData>(`https://api.binance.com/api/v3/exchangeInfo`);
  }
}
