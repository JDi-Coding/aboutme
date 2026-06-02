import { Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { NavigationService } from '../../services/navigation.service';

const NAV_ITEMS = [
  { id: 'personnel', label: 'Personnel' },
  { id: 'missions',  label: 'Missions'  },
  { id: 'stellar',   label: 'Stellar Map'},
  { id: 'bridge',    label: 'Bridge'    },
  { id: 'comms',     label: 'Subspace'  },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  template: `
    <div class="sidebar">
      <div class="deco-block"></div>
      <div class="deco-block"></div>
      @for (item of navItems; track item.id) {
        <button
          class="nav-btn"
          [class.active]="(activeRoute$ | async) === item.id"
          (click)="navigate(item.id)">
          {{ item.label }}
        </button>
      }
      <div class="nav-filler"></div>
      <div style="text-align: right; padding-right: 10px; color: var(--lcars-gold);">LCARS 47</div>
    </div>
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
