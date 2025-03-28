import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round',
  standalone: true,
})
export class RoundPipe implements PipeTransform {
  transform(value: string | number): string {
    const num = parseFloat(value as string);

    return isNaN(num) ? '0.00' : num.toFixed(2);
  }
}
