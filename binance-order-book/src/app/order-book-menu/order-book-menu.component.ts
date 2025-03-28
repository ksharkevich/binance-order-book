import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TuiButton, TuiDataList, TuiLoader, TuiScrollable } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { TuiMultiSelectModule } from '@taiga-ui/legacy';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { OrderBookItemComponent } from '../order-book-item/order-book-item.component';
import { AsyncPipe, NgForOf } from '@angular/common';
import { OrderBookMenuService } from './order-book-menu.service';
import { Observable } from 'rxjs';
import { TradingPair } from '../data/trading-pair';
import { BinanceExchangeInfoDataService } from '../data/binance-exchange-info-data.service';
import { tuiPure } from '@taiga-ui/cdk';
import { FilterPairsPipe } from './filter-pairs.pipe';

@Component({
  selector: 'app-order-book-menu',
  standalone: true,
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    FormsModule,
    TuiDataList,
    TuiMultiSelectModule,
    TuiScrollable,
    OrderBookItemComponent,
    NgForOf,
    AsyncPipe,
    TuiLoader,
    TuiButton,
    FilterPairsPipe,
  ],
  providers: [OrderBookMenuService, BinanceExchangeInfoDataService],
  templateUrl: './order-book-menu.component.html',
  styleUrl: './order-book-menu.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderBookMenuComponent implements OnInit {
  public selectedPairs: TradingPair[] = [];
  public orderBookItems: TradingPair[] = [];
  public tradingPairs$!: Observable<TradingPair[] | null>;
  public isLoading$!: Observable<boolean>;

  constructor(public pairsListMenuService: OrderBookMenuService) {}

  ngOnInit() {
    this.isLoading$ = this.pairsListMenuService.loading$;
    this.tradingPairs$ = this.pairsListMenuService.getTradingPairsUSDT$();
  }

  @tuiPure
  public stringify(tradingPairs: TradingPair[]): string[] {
    return tradingPairs.map(({ symbol }) => symbol);
  }

  public selectPairs(): void {
    const newItems = this.selectedPairs.filter(pair =>
      !this.orderBookItems.some(existingPair => existingPair.symbol === pair.symbol),
    );

    this.orderBookItems = [...this.orderBookItems, ...newItems];
  }

  public removeOrderBook(tradingPair: TradingPair): void {
    this.orderBookItems = this.orderBookItems.filter(pair => pair.symbol !== tradingPair.symbol);
    this.selectedPairs = this.selectedPairs.filter(pair => pair.symbol !== tradingPair.symbol);
  }

  public trackById(_: number, item: TradingPair): string {
    return item.symbol;
  }
}
