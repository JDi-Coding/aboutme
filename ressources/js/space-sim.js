/**
 * Space Simulation and Autopilot (FIXED)
 */

export class SpaceSim {
	constructor(canvasId, controls) {

		this.canvas = document.getElementById(canvasId);
		if (!this.canvas) throw new Error(`Canvas #${canvasId} not found`);

		this.ctx = this.canvas.getContext('2d');
		if (!this.ctx) throw new Error("2D context not available");

		this.controls = controls;

		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.xShift = parseFloat(controls.xShift.value);
		this.yShift = parseFloat(controls.yShift.value);
		this.speed = parseFloat(controls.speed.value);
		this.starCount = parseInt(controls.density.value);
		this.projectionFactor = parseFloat(controls.focus.value);
		this.nebulaIntensity = parseFloat(controls.nebulaIntensity.value);

		this.nebulaCount = 15;

		this.stars = [];
		this.nebulas = [];

		this.starColors = ["#ffffff", "#cce6ff", "#e6ccff", "#e8e3c5"];
		this.nebulaColors = [
			"rgba(20, 0, 255, [INTENSITY])",
			"rgba(188, 19, 254, [INTENSITY])",
			"rgba(0, 210, 255, [INTENSITY])"
		];

		this.animate = this.animate.bind(this);

		this.init();
	}

	init() {
		this.resize();
		this.initElements();
		window.addEventListener('resize', () => this.resize());
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	}

	initElements() {
		this.stars = [];
		for (let i = 0; i < this.starCount; i++) {
			this.stars.push(this.createStar());
		}

		if (this.nebulas.length === 0) {
			for (let i = 0; i < this.nebulaCount; i++) {
				this.nebulas.push(this.createNebula());
			}
		}
	}

	createStar(randomZ = true) {
		return {
			x: (Math.random() - 0.5) * this.width * 2,
			y: (Math.random() - 0.5) * this.height * 2,
			z: randomZ ? Math.random() * this.width : this.width,
			color: this.starColors[Math.floor(Math.random() * this.starColors.length)],
			size: Math.random() * 2,

			update(sim) {
				this.z -= sim.speed * 2;
				this.x -= sim.xShift * sim.speed * 5.0;
				this.y -= sim.yShift * sim.speed * 5.0;

				if (this.z <= 1) {
					Object.assign(this, sim.createStar(false));
				}
			},

			draw(sim) {
				const x = (this.x / this.z) * (sim.width / 2) * sim.projectionFactor + (sim.width / 2);
				const y = (this.y / this.z) * (sim.height / 2) * sim.projectionFactor + (sim.height / 2);

				let radius = (1 - this.z / sim.width) * this.size;
				if (radius < 0) radius = 0;

				sim.ctx.beginPath();
				sim.ctx.fillStyle = this.color;
				sim.ctx.arc(x, y, radius, 0, Math.PI * 2);
				sim.ctx.fill();
			}
		};
	}

	createNebula(randomZ = true) {
		return {
			x: (Math.random() - 0.5) * this.width * 1.5,
			y: (Math.random() - 0.5) * this.height * 1.5,
			z: randomZ ? Math.random() * this.width : this.width,
			baseColorIndex: Math.floor(Math.random() * this.nebulaColors.length),
			radius: 100 + Math.random() * 300,

			update(sim) {
				this.z -= sim.speed * 0.45;
				this.x -= sim.xShift * sim.speed * 1.0;
				this.y -= sim.yShift * sim.speed * 1.0;

				if (this.z <= 1) {
					Object.assign(this, sim.createNebula(false));
				}
			},

			draw(sim) {
				const x = (this.x / this.z) * (sim.width / 2) * sim.projectionFactor + (sim.width / 2);
				const y = (this.y / this.z) * (sim.height / 2) * sim.projectionFactor + (sim.height / 2);

				const scale = (1 - this.z / sim.width);
				const drawRadius = this.radius * scale;

				if (!isFinite(x) || !isFinite(y) || !isFinite(drawRadius) || drawRadius <= 0) return;

				const baseColor = sim.nebulaColors[this.baseColorIndex];
				const color = baseColor.replace('[INTENSITY]', sim.nebulaIntensity.toFixed(2));

				const gradient = sim.ctx.createRadialGradient(x, y, 0, x, y, drawRadius);
				gradient.addColorStop(0, color);
				gradient.addColorStop(1, "rgba(0,0,0,0)");

				sim.ctx.fillStyle = gradient;
				sim.ctx.beginPath();
				sim.ctx.arc(x, y, drawRadius, 0, Math.PI * 2);
				sim.ctx.fill();
			}
		};
	}

	animate() {
		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(0, 0, this.width, this.height);

		this.ctx.globalCompositeOperation = 'lighter';
		this.nebulas.forEach(n => {
			n.update(this);
			n.draw(this);
		});

		this.ctx.globalCompositeOperation = 'source-over';
		this.stars.forEach(s => {
			s.update(this);
			s.draw(this);
		});

		requestAnimationFrame(this.animate);
	}

	reset() {
		this.speed = 2.0;
		this.starCount = 630;
		this.projectionFactor = 1.0;
		this.nebulaIntensity = 0.35;
		this.xShift = 0.0;
		this.yShift = 0.0;

		this.initElements();
		this.updateUI();
	}

	updateUI() {
		const c = this.controls;

		c.speed.value = this.speed;
		c.density.value = this.starCount;
		c.focus.value = this.projectionFactor;
		c.nebulaIntensity.value = this.nebulaIntensity;
		c.xShift.value = this.xShift;
		c.yShift.value = this.yShift;

		c.displaySpeed.textContent = this.speed.toFixed(1);
		c.displayDensity.textContent = this.starCount.toString();
		c.displayFocus.textContent = this.projectionFactor.toFixed(1);
		c.displayNebulaIntensity.textContent = this.nebulaIntensity.toFixed(2);
		c.displayXShift.textContent = this.xShift.toFixed(2);
		c.displayYShift.textContent = this.yShift.toFixed(2);
	}
}

export class AutoPilot {
	constructor(sim) {
		this.sim = sim;
		this.intervalId = null;
		this.updateInterval = 3000;
		this.animation = { requestId: null };
	}

	start() {
		if (this.intervalId) return;
		this.updateStatus(true);
		this.intervalId = setInterval(() => this.update(), this.updateInterval);
		this.update();
	}

	stop() {
		this.updateStatus(false);

		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}

		if (this.animation.requestId) {
			cancelAnimationFrame(this.animation.requestId);
			this.animation.requestId = null;
		}
	}

	updateStatus(isActive) {
		const el = document.getElementById('autopilot-status');
		if (!el) return;

		el.textContent = isActive ? 'ONLINE' : 'OFFLINE';
		el.className = isActive ? 'status-tag status-on' : 'status-tag';
	}

	update() {
		const targets = {
			speed: 0.1 + Math.random() * 10,
			starCount: 100 + Math.floor(Math.random() * 9000),
			projectionFactor: 0.5 + Math.random() * 1.5,
			nebulaIntensity: 0.1 + Math.random() * 0.9,
			xShift: (Math.random() * 2) - 1,
			yShift: (Math.random() * 2) - 1
		};

		this.animateTo(targets, this.updateInterval - 300);
	}

	animateTo(targets, duration) {
		if (this.animation.requestId) cancelAnimationFrame(this.animation.requestId);

		const startTime = performance.now();

		const startValues = {
			speed: this.sim.speed,
			starCount: this.sim.starCount,
			projectionFactor: this.sim.projectionFactor,
			nebulaIntensity: this.sim.nebulaIntensity,
			xShift: this.sim.xShift,
			yShift: this.sim.yShift
		};

		const step = (t) => {
			const p = Math.min(1, (t - startTime) / duration);
			const ease = p < 0.5
				? 4 * p * p * p
				: 1 - Math.pow(-2 * p + 2, 3) / 2;

			Object.keys(targets).forEach(key => {
				this.sim[key] =
					startValues[key] +
					(targets[key] - startValues[key]) * ease;
				if (key === "starCount") {
					const target = Math.floor(this.sim.starCount);
					const current = this.sim.stars.length;

					if (current < target) {
						for (let i = 0; i < target - current; i++) {
							this.sim.stars.push(this.sim.createStar());
						}
					}
					else if (current > target) this.sim.stars.length = target;
				}
			});

			this.sim.updateUI();

			if (p < 1) {
				this.animation.requestId = requestAnimationFrame(step);
			}
		};

		this.animation.requestId = requestAnimationFrame(step);
	}
}