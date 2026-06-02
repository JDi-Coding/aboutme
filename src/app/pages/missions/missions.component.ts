import { Component } from '@angular/core';

@Component({
  selector: 'app-missions',
  standalone: true,
  template: `
    <h2>Mission Logs (Portfolio)</h2>
    <p>Access to archived mission reports and technical projects.</p>
    <div class="data-grid">
      <div class="data-card">
        <h3>Project: Agens Wegweiser</h3>
        <p>Development of web application for the digitized administration of aid offers in Berlin.
          <br><br><em>Stack: php, JS, SQL, 3rd-party-integrations</em>
          <br><em>Status: Deployed</em>
        </p>
      </div>
      <div class="data-card">
        <h3>Project: BarneyBot</h3>
        <p>A custom automation bot designed for community interaction and server management.
          <br><br><em>Stack: Python, SQL, AI Integration (local)</em>
          <br><br><em>Status: Finished</em>
        </p>
        <button>
          <a href="https://github.com/JDi-Coding/BarneyBot" target="_blank" class="project-link">ACCESS DATA</a>
        </button>
      </div>
      <div class="data-card">
        <h3>Project: PCessentials</h3>
        <p>Essential utility scripts and configurations for optimizing and setting up PC environments.
          <br><br><em>Stack: C#, JSON, base64, winForms (.NET)</em>
          <br><em>Status: development</em>
        </p>
        <button>
          <a href="https://github.com/JDi-Coding/PCessentials" target="_blank" class="project-link">ACCESS DATA</a>
        </button>
      </div>
    </div>
  `,
})
export class MissionsComponent {}
