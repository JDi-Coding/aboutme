import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StardateService } from '../../services/stardate.service';
import { LangSwitcherComponent } from '../lang-switcher/lang-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, LangSwitcherComponent],
  template: `
      <div class="lcars-elbow">
        <span style="color:black; font-weight:bold; font-size: 2rem; margin-right: 10px;">01</span>
      </div>
      <div class="header-bar">
        <span>{{ 'header.federation' | translate }}</span>
        <span id="stardate" class="stardate-display">{{ stardate$ | async }}</span>
        <span>{{ 'header.ship' | translate }}</span>
        <app-lang-switcher></app-lang-switcher>
      </div>
  `,
})
export class HeaderComponent {
  stardate$ = this.stardateService.stardate$;
  constructor(private stardateService: StardateService) {}
}
