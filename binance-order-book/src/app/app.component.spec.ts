import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OrderBookMenuComponent } from './order-book-menu/order-book-menu.component';
import { TuiRoot } from '@taiga-ui/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterOutlet,
        OrderBookMenuComponent,
        TuiRoot,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  });

  it('should show "Binance Order Book"', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Binance Order Book');
  });

});
