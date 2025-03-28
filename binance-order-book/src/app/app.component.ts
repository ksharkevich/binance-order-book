import { TuiRoot } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderBookMenuComponent } from './order-book-menu/order-book-menu.component';

@Component({
  selector: 'app-root',
  templateUrl:'app.component.html',
  styleUrl: './app.component.less',
  standalone: true,
  imports: [RouterOutlet, OrderBookMenuComponent, TuiRoot],
})
export class AppComponent {
  title = 'binance-order-book';
}
