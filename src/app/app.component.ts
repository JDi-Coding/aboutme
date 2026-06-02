import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SpaceCanvasComponent } from './components/space-canvas/space-canvas.component';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, SpaceCanvasComponent],
  template: `
    <app-space-canvas></app-space-canvas>

    <div class="lcars-grid">
      <app-header class="header-top"></app-header>

      <app-sidebar class="sidebar"></app-sidebar>

      <main class="main-viewer">
        <div class="viewer-content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(
    private navigationService: NavigationService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    // Restore last chosen language, default to 'en'
    const saved = localStorage.getItem('lang') ?? 'en';
    this.translate.addLangs(['en', 'de']);
    this.translate.setDefaultLang('en');
    this.translate.use(saved);
  }
}
