import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { StardateService } from '../../services/stardate.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="header-top">
      <div class="lcars-elbow">
        <span style="color:black; font-weight:bold; font-size: 2rem; margin-right: 10px;">01</span>
      </div>
      <div class="header-bar">
        <span>United Federation of Planets</span>
        <span id="stardate" class="stardate-display">{{ stardate$ | async }}</span>
        <span>USS ENTERPRISE</span>
      </div>
    </div>
  `,
})
export class HeaderComponent {
  stardate$ = this.stardateService.stardate$;
  constructor(private stardateService: StardateService) {}
}
