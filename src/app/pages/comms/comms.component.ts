import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comms',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ 'comms.title' | translate }}</h1>
    <br>
    <a href="https://github.com/JDi-Coding" target="_blank" class="github-link">
      <i class="fab fa-github"></i> GitHub
    </a>
  `,
})
export class CommsComponent {}
