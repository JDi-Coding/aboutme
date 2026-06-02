import { Component } from '@angular/core';

@Component({
  selector: 'app-personnel',
  standalone: true,
  template: `
    <h2>Personnel File: SC-937-0176</h2>
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <div style="width: 150px; height: 150px; background: var(--lcars-blue); display: flex; align-items: center; justify-content: center; color: black; font-weight: bold;">
        [IMG ID]
      </div>
      <div>
        <p>
          <strong>Name:</strong> JDi-Coding <br>
          <strong>Rank:</strong> Junior Developer<br>
          <strong>Assignment:</strong> Web-Development <br>
          <strong>Species:</strong> Human<br>
          <strong>Status:</strong> Active Duty
        </p>
      </div>
    </div>
    <h3>Service Summary</h3>
    <p>Passionate Web Developer building the digital future.</p>
    <p class="skills-container">
      <span>PHP</span>
      <span>JS</span>
      <span>C#</span>
      <span>PYTHON</span>
    </p>
  `,
})
export class PersonnelComponent {}
