import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h2>{{ 'missions.title' | translate }}</h2>
    <p>{{ 'missions.subtitle' | translate }}</p>
    <div class="data-grid">
      <div class="data-card">
        <h3>{{ 'missions.project1.title' | translate }}</h3>
        <p>{{ 'missions.project1.desc' | translate }}
          <br><br><em>{{ 'missions.project1.stack' | translate }}</em>
          <br><em>{{ 'missions.project1.status' | translate }}</em>
        </p>
      </div>
      <div class="data-card">
        <h3>{{ 'missions.project2.title' | translate }}</h3>
        <p>{{ 'missions.project2.desc' | translate }}
          <br><br><em>{{ 'missions.project2.stack' | translate }}</em>
          <br><br><em>{{ 'missions.project2.status' | translate }}</em>
        </p>
        <button class="project-link">
          <a href="https://github.com/JDi-Coding/BarneyBot" target="_blank" >
            {{ 'missions.access' | translate }}
          </a>
        </button>
      </div>
      <div class="data-card">
        <h3>{{ 'missions.project3.title' | translate }}</h3>
        <p>{{ 'missions.project3.desc' | translate }}
          <br><br><em>{{ 'missions.project3.stack' | translate }}</em>
          <br><em>{{ 'missions.project3.status' | translate }}</em>
        </p>
        <button class="project-link">
          <a href="https://github.com/JDi-Coding/PCessentials" target="_blank" >
            {{ 'missions.access' | translate }}
          </a>
        </button>
      </div>
    </div>
  `,
})
export class MissionsComponent {}
