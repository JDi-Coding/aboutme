import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-stellar',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h2>{{ 'stellar.title' | translate }}</h2>
    <p>{{ 'stellar.subtitle' | translate }}</p>
    <div style="width: 100%; height: 300px; border: 1px dashed var(--lcars-light-blue); display: flex; align-items: center; justify-content: center;">
      <span style="color: var(--lcars-red); animation: blink 1s infinite;">
        {{ 'stellar.scanning' | translate }}
      </span>
    </div>
    <p>{{ 'stellar.coordinates' | translate }}</p>
  `,
})
export class StellarComponent {}
