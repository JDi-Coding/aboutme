import { Component } from '@angular/core';

@Component({
  selector: 'app-stellar',
  standalone: true,
  template: `
    <h2>Stellar Cartography</h2>
    <p>Interactive astrometric data [Simulation]. Click on sectors for details.</p>
    <div style="width: 100%; height: 300px; border: 1px dashed var(--lcars-light-blue); display: flex; align-items: center; justify-content: center;">
      <span style="color: var(--lcars-red); animation: blink 1s infinite;">// LONG RANGE SENSOR SCAN IN PROGRESS //</span>
    </div>
    <p>Known coordinates: Sector 001 (Earth), Vulcan, Deep Space 9.</p>
  `,
})
export class StellarComponent {}
