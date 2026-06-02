import { Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SpaceService, SpaceState } from '../../services/space.service';

@Component({
  selector: 'app-bridge',
  standalone: true,
  imports: [AsyncPipe, NgClass, FormsModule, TranslateModule],
  template: `
    @if (state$ | async; as state) {
      <h2 class="lcars-section-title">{{ 'bridge.title' | translate }}</h2>
      <div class="control-grid">

        <div class="control-group">
          <div class="control-label">{{ 'bridge.warp' | translate }}: <span class="data-val">{{ state.speed.toFixed(1) }}</span></div>
          <input type="range" class="lcars-slider orange"
            min="0.1" max="10" step="0.1"
            [value]="state.speed"
            (input)="update('speed', $event)" />
        </div>

        <div class="control-group">
          <div class="control-label">{{ 'bridge.density' | translate }}: <span class="data-val">{{ state.starCount.toFixed(0) }}</span></div>
          <input type="range" class="lcars-slider blue"
            min="100" max="10000" step="100"
            [value]="state.starCount"
            (input)="updateInt('starCount', $event)" />
        </div>

        <div class="control-group">
          <div class="control-label">{{ 'bridge.focus' | translate }}: <span class="data-val">{{ state.projectionFactor.toFixed(1) }}</span></div>
          <input type="range" class="lcars-slider purple"
            min="0.5" max="2" step="0.1"
            [value]="state.projectionFactor"
            (input)="update('projectionFactor', $event)" />
        </div>

        <div class="control-group">
          <div class="control-label">{{ 'bridge.nebula' | translate }}: <span class="data-val">{{ state.nebulaIntensity.toFixed(2) }}</span></div>
          <input type="range" class="lcars-slider purple"
            min="0.1" max="1.0" step="0.05"
            [value]="state.nebulaIntensity"
            (input)="update('nebulaIntensity', $event)" />
        </div>

        <div class="control-group">
          <div class="control-label">{{ 'bridge.lateral_x' | translate }}: <span class="data-val">{{ state.xShift.toFixed(2) }}</span></div>
          <input type="range" class="lcars-slider gold"
            min="-1.0" max="1.0" step="0.01"
            [value]="state.xShift"
            (input)="update('xShift', $event)" />
        </div>

        <div class="control-group">
          <div class="control-label">{{ 'bridge.lateral_y' | translate }}: <span class="data-val">{{ state.yShift.toFixed(2) }}</span></div>
          <input type="range" class="lcars-slider gold"
            min="-1.0" max="1.0" step="0.01"
            [value]="state.yShift"
            (input)="update('yShift', $event)" />
        </div>

        <div class="control-group toggle-group">
          <div class="control-label">
            {{ 'bridge.autopilot' | translate }}:
            <span class="status-tag"
              [ngClass]="state.autopilotActive ? 'status-on' : 'status-off'">
              {{ (state.autopilotActive ? 'bridge.online' : 'bridge.offline') | translate }}
            </span>
          </div>
          <br>
          <label class="lcars-btn-toggle">
            <input style="opacity: 0;" type="checkbox"
              [checked]="state.autopilotActive"
              (change)="toggleAutopilot(state.autopilotActive)" />
            {{ 'bridge.engage' | translate }}
          </label>
        </div>

        <div class="modal-footer-actions">
          <button class="lcars-action-btn red reset-btn" (click)="reset()">
            {{ 'bridge.reset' | translate }}
          </button>
        </div>

      </div>
    }
  `,
})
export class BridgeComponent {
  state$ = this.spaceService.state$;

  constructor(private spaceService: SpaceService) {}

  update(key: keyof SpaceState, event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.spaceService.updateState({ [key]: value });
  }

  updateInt(key: keyof SpaceState, event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.spaceService.updateState({ [key]: value });
  }

  toggleAutopilot(current: boolean): void {
    this.spaceService.updateState({ autopilotActive: !current });
  }

  reset(): void {
    this.spaceService.resetState();
  }
}
