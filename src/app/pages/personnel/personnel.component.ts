import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ 'personnel.title' | translate }}</h1>
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div style="width: 150px; height: 150px; background: var(--lcars-blue); display: flex; align-items: center; justify-content: center; color: black; font-weight: bold;">
        [IMG ID]
      </div>
      <div>
        <p>
          <strong>{{ 'personnel.label_name' | translate }}:</strong> {{ 'personnel.name' | translate }}<br>
          <strong>{{ 'personnel.label_rank' | translate }}:</strong> {{ 'personnel.rank' | translate }}<br>
          <strong>{{ 'personnel.label_assignment' | translate }}:</strong> {{ 'personnel.assignment' | translate }}<br>
          <strong>{{ 'personnel.label_species' | translate }}:</strong> {{ 'personnel.species' | translate }}<br>
          <strong>{{ 'personnel.label_status' | translate }}:</strong> {{ 'personnel.status' | translate }}
        </p>
      </div>
    </div>
    <h3>{{ 'personnel.summary_title' | translate }}</h3>
    <p>{{ 'personnel.summary_text' | translate }}</p>
    <p class="skills-container">
      <span>PHP</span>
      <span>JS</span>
      <span>C#</span>
      <span>PYTHON</span>
    </p>
  `,
})
export class PersonnelComponent {}
