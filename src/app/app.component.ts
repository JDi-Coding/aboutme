import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
      <app-header></app-header>

      <app-sidebar></app-sidebar>

      <main class="main-viewer">
        <div class="viewer-content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(private navigationService: NavigationService) {}

  // NavigationService must be injected in root to start listening to Router events immediately
  ngOnInit(): void {}
}
