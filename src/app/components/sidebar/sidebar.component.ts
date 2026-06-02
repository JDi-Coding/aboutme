import { Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AudioService } from '../../services/audio.service';
import { NavigationService } from '../../services/navigation.service';

const NAV_ITEMS = [
  { id: 'personnel', labelKey: 'nav.personnel' },
  { id: 'missions',  labelKey: 'nav.missions'  },
  { id: 'stellar',   labelKey: 'nav.stellar'   },
  { id: 'bridge',    labelKey: 'nav.bridge'    },
  { id: 'comms',     labelKey: 'nav.comms'     },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AsyncPipe, NgClass, TranslateModule],
  template: `
      <div class="deco-block"></div>
      <div class="deco-block"></div>
      @for (item of navItems; track item.id) {
        <button
          class="nav-btn"
          [class.active]="(activeRoute$ | async) === item.id"
          (click)="navigate(item.id)">
          {{ item.labelKey | translate }}
        </button>
      }
      <div class="nav-filler"></div>
      <div style="text-align: right; padding-right: 10px; color: var(--lcars-gold);">LCARS 47</div>
  `,
})
export class SidebarComponent {
  navItems = NAV_ITEMS;
  activeRoute$ = this.navigationService.activeRoute$;

  constructor(
    private router: Router,
    private audioService: AudioService,
    private navigationService: NavigationService,
  ) {}

  navigate(sectionId: string): void {
    this.audioService.playBeep();
    this.router.navigate([sectionId]);
  }
}
