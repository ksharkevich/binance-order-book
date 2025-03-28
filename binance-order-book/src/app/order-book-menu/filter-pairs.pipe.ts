import { Pipe, PipeTransform } from '@angular/core';
import { TradingPair } from '../data/trading-pair';

@Pipe({
  name: 'filterPairs',
  standalone: true
})
export class FilterPairsPipe implements PipeTransform {
  transform(tradingPairs: TradingPair[] | null, selectedPairs: TradingPair[]): TradingPair[] {
    return tradingPairs?.filter(pair => !selectedPairs.some(selectedPair => selectedPair.symbol === pair.symbol)) || [];
  }
}
