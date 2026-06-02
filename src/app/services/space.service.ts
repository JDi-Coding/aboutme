import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SpaceState {
  speed: number;
  starCount: number;
  projectionFactor: number;
  nebulaIntensity: number;
  xShift: number;
  yShift: number;
  autopilotActive: boolean;
  autopilotRunning: boolean;
}

const DEFAULTS: SpaceState = {
  speed: 2.0,
  starCount: 630,
  projectionFactor: 1.0,
  nebulaIntensity: 0.35,
  xShift: 0.0,
  yShift: 0.0,
  autopilotActive: false,
  autopilotRunning: false,
};

const NEBULA_COUNT = 15;
const STAR_COLORS = ['#ffffff', '#cce6ff', '#e6ccff', '#e8e3c5'];
const NEBULA_COLORS = [
  'rgba(20, 0, 255, [INTENSITY])',
  'rgba(188, 19, 254, [INTENSITY])',
  'rgba(0, 210, 255, [INTENSITY])',
];

@Injectable({ providedIn: 'root' })
export class SpaceService implements OnDestroy {

  private _state$ = new BehaviorSubject<SpaceState>({ ...DEFAULTS });
  readonly state$ = this._state$.asObservable();

  // Canvas rendering
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private width = 0;
  private height = 0;

  // Simulation state (mirrors _state$ for hot-path performance)
  private speed = DEFAULTS.speed;
  private starCount = DEFAULTS.starCount;
  private projectionFactor = DEFAULTS.projectionFactor;
  private nebulaIntensity = DEFAULTS.nebulaIntensity;
  private xShift = DEFAULTS.xShift;
  private yShift = DEFAULTS.yShift;

  private stars: Star[] = [];
  private nebulas: Nebula[] = [];

  // AutoPilot
  private autopilotIntervalId: ReturnType<typeof setInterval> | null = null;
  private autopilotAnimation: AutopilotAnimation | null = null;
  private autopilotState = { speed: DEFAULTS.speed, starCount: DEFAULTS.starCount, projectionFactor: DEFAULTS.projectionFactor, nebulaIntensity: DEFAULTS.nebulaIntensity, xShift: DEFAULTS.xShift, yShift: DEFAULTS.yShift };

  // ─── Public API ─────────────────────────────────────────────────────────────

  attachCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    this.initElements();
    this.animate();
  }

  detachCanvas(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.stopAutopilot();
    this.canvas = null;
    this.ctx = null;
  }

  onResize(): void {
    this.resize();
  }

  get snapshot(): SpaceState {
    return this._state$.getValue();
  }

  updateState(partial: Partial<SpaceState>): void {
    const current = this._state$.getValue();
    const next = { ...current, ...partial };
    this._state$.next(next);

	// needed for cleaner canvas simulation
	if(partial.autopilotRunning === undefined) partial.autopilotRunning = false;

    // Sync simulation vars
    if (partial.speed !== undefined) this.speed = partial.speed;
    if (partial.starCount !== undefined) { this.starCount = partial.starCount; if (!partial.autopilotRunning ) this.initElements(); }
    if (partial.projectionFactor !== undefined) this.projectionFactor = partial.projectionFactor;
    if (partial.nebulaIntensity !== undefined) this.nebulaIntensity = partial.nebulaIntensity;
    if (partial.xShift !== undefined) this.xShift = partial.xShift;
    if (partial.yShift !== undefined) this.yShift = partial.yShift;

    if (partial.autopilotActive !== undefined) {
      partial.autopilotActive ? this.startAutopilot() : this.stopAutopilot();
    }
  }

  resetState(): void {
    this.updateState({ ...DEFAULTS, autopilotActive: false });
    this.initElements();
  }

  // ─── Rendering ──────────────────────────────────────────────────────────────

  private resize(): void {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private initElements(): void {
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push(new Star(this.width, this.height, STAR_COLORS, true));
    }
    if (this.nebulas.length === 0) {
      for (let i = 0; i < NEBULA_COUNT; i++) {
        this.nebulas.push(new Nebula(this.width, this.height, NEBULA_COLORS, true));
      }
    }
  }

  private animate = (): void => {
    if (!this.ctx || !this.canvas) return;

    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.globalCompositeOperation = 'lighter';

    for (const nebula of this.nebulas) {
      nebula.update(this.speed, this.xShift, this.yShift);
      nebula.draw(this.ctx, this.width, this.height, this.projectionFactor, this.nebulaIntensity);
    }

    this.ctx.globalCompositeOperation = 'source-over';

    for (const star of this.stars) {
      star.update(this.speed, this.xShift, this.yShift);
      star.draw(this.ctx, this.width, this.height, this.projectionFactor);
    }

    this.animFrameId = requestAnimationFrame(this.animate);
  };

  // ─── AutoPilot ──────────────────────────────────────────────────────────────

  private startAutopilot(): void {
    if (this.autopilotIntervalId !== null) return;
    this.autopilotIntervalId = setInterval(() => this.autopilotUpdate(), 3000);
    this.autopilotUpdate();
  }

  private stopAutopilot(): void {
    if (this.autopilotIntervalId !== null) {
      clearInterval(this.autopilotIntervalId);
      this.autopilotIntervalId = null;
    }
    if (this.autopilotAnimation?.requestId) {
      cancelAnimationFrame(this.autopilotAnimation.requestId);
      this.autopilotAnimation = null;
    }
  }

  private autopilotUpdate(): void {
    const targets: Partial<SpaceState> = {
      speed: 0.1 + (10.0 - 0.1) * Math.random(),
      starCount: Math.floor(100 + (10000 - 100) * Math.random()),
      projectionFactor: 0.5 + (2.0 - 0.5) * Math.random(),
      nebulaIntensity: 0.1 + (1.0 - 0.1) * Math.random(),
      xShift: Math.random() * 2 - 1,
      yShift: Math.random() * 2 - 1,
    };
    this.autopilotAnimateTo(targets, 2700);
  }

  private autopilotAnimateTo(targets: Partial<SpaceState>, duration: number): void {
    if (this.autopilotAnimation?.requestId) {
      cancelAnimationFrame(this.autopilotAnimation.requestId);
    }

    const current = this._state$.getValue();
    const startValues: Record<string, number> = {};
    const endValues: Record<string, number> = {};

    for (const key of Object.keys(targets) as Array<keyof SpaceState>) {
      if (key === 'autopilotActive') continue;
      startValues[key] = current[key] as number;
      endValues[key] = targets[key] as number;
      this.autopilotState[key as keyof typeof this.autopilotState] = current[key] as number;
    }

    const startTime = performance.now();

    const tick = (timestamp: number): void => {
      const progress = Math.min(1, (timestamp - startTime) / duration);
      const eased = easeInOutCubic(progress);

      const patch: Partial<SpaceState> = {};
      for (const key of Object.keys(startValues)) {

        const val = startValues[key] + (endValues[key] - startValues[key]) * eased;
        (patch as Record<string, number>)[key] = val;
		if (key === "starCount") {

			  const target = Math.floor(this.starCount);
			  const current = this.stars.length;

			  if (current < target) {
				  for (let i = 0; i < target - current; i++) {
					  this.stars.push(new Star(this.width, this.height, STAR_COLORS, true));
				  }
			  }
			  else if (current > target) this.stars.splice(target);

		  }
      }
	  patch.autopilotRunning = true;
      this.updateState(patch);

      if (progress < 1 && this.autopilotAnimation) {
        this.autopilotAnimation.requestId = requestAnimationFrame(tick);
      } else if (this.autopilotAnimation) {
        this.autopilotAnimation.requestId = null;
      }
    };

    this.autopilotAnimation = { requestId: requestAnimationFrame(tick) };
  }

  ngOnDestroy(): void {
    this.detachCanvas();
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface AutopilotAnimation {
  requestId: number | null;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

class Star {
  x = 0; y = 0; z = 0;
  color = '#ffffff';
  size = 1;

  constructor(
    private width: number,
    private height: number,
    private colors: string[],
    randomZ: boolean
  ) {
    this.init(randomZ);
  }

  init(randomZ: boolean): void {
    this.x = (Math.random() - 0.5) * this.width * 2;
    this.y = (Math.random() - 0.5) * this.height * 2;
    this.z = randomZ ? Math.random() * this.width : this.width;
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.size = Math.random() * 2;
  }

  update(speed: number, xShift: number, yShift: number): void {
    this.z -= speed * 2;
    this.x -= xShift * speed * 5.0;
    this.y -= yShift * speed * 5.0;
    if (this.z <= 1) this.init(false);
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, projectionFactor: number): void {
    const x = (this.x / this.z) * (width / 2) * projectionFactor + width / 2;
    const y = (this.y / this.z) * (height / 2) * projectionFactor + height / 2;
    let radius = (1 - this.z / width) * this.size;
    if (radius < 0) radius = 0;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Nebula {
  x = 0; y = 0; z = 0;
  baseColorIndex = 0;
  radius = 100;

  constructor(
    private width: number,
    private height: number,
    private colors: string[],
    randomZ: boolean
  ) {
    this.init(randomZ);
  }

  init(randomZ: boolean): void {
    this.x = (Math.random() - 0.5) * this.width * 1.5;
    this.y = (Math.random() - 0.5) * this.height * 1.5;
    this.z = randomZ ? Math.random() * this.width : this.width;
    this.baseColorIndex = Math.floor(Math.random() * this.colors.length);
    this.radius = 100 + Math.random() * 300;
  }

  update(speed: number, xShift: number, yShift: number): void {
    this.z -= speed * 0.45;
    this.x -= xShift * speed * 1.0;
    this.y -= yShift * speed * 1.0;
    if (this.z <= 1) this.init(false);
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, projectionFactor: number, nebulaIntensity: number): void {
    const x = (this.x / this.z) * (width / 2) * projectionFactor + width / 2;
    const y = (this.y / this.z) * (height / 2) * projectionFactor + height / 2;
    const scale = 1 - this.z / width;
    let drawRadius = this.radius * scale;
    if (drawRadius <= 0) return;
    if (!isFinite(x) || !isFinite(y) || !isFinite(drawRadius)) return;

    const color = this.colors[this.baseColorIndex].replace('[INTENSITY]', nebulaIntensity.toFixed(2));
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, drawRadius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, drawRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}
