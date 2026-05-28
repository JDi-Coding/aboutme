import { updateStardate } from './utils.js';
import { loadContent } from './navigation.js';
import { SpaceSim, AutoPilot } from './space-sim.js';

document.addEventListener("DOMContentLoaded", () => {

    // 1. Initialize Utilities
    updateStardate();
    setInterval(updateStardate, 10000);

    // 2. Setup Space Simulation
    const controls = {
        speed: document.getElementById('speed-control'),
        density: document.getElementById('density-control'),
        focus: document.getElementById('focus-control'),
        nebula: document.getElementById('nebula-intensity-control'),
        xShift: document.getElementById('x-shift-control'),
        yShift: document.getElementById('y-shift-control'),
        displaySpeed: document.getElementById('current-speed'),
        displayDensity: document.getElementById('current-density'),
        displayFocus: document.getElementById('current-focus'),
        displayNebula: document.getElementById('current-nebula-intensity'),
        displayXShift: document.getElementById('current-x-shift'),
        displayYShift: document.getElementById('current-y-shift')
    };

	const sim = new SpaceSim('space-canvas', controls);
	const autopilot = new AutoPilot(sim);

    // 3. Event Listeners for Simulation Controls
    controls.speed.addEventListener('input', () => {
        sim.speed = parseFloat(controls.speed.value);
        sim.updateUI();
    });

    controls.density.addEventListener('input', () => {
        sim.starCount = parseInt(controls.density.value);
        sim.initElements();
        sim.updateUI();
    });

    controls.focus.addEventListener('input', () => {
        sim.projectionFactor = parseFloat(controls.focus.value);
        sim.updateUI();
    });

    controls.nebula.addEventListener('input', () => {
        sim.nebulaIntensity = parseFloat(controls.nebula.value);
        sim.updateUI();
    });

    controls.xShift.addEventListener('input', () => {
        sim.xShift = parseFloat(controls.xShift.value);
        sim.updateUI();
    });

    controls.yShift.addEventListener('input', () => {
        sim.yShift = parseFloat(controls.yShift.value);
        sim.updateUI();
    });

    const autopilotToggle = document.getElementById('autopilot-toggle');
    autopilotToggle.addEventListener('change', () => {
        if (autopilotToggle.checked) {
            autopilot.start();
        } else {
            autopilot.stop();
        }
    });

    const resetBtn = document.querySelector('.reset-btn');
    resetBtn.addEventListener('click', () => {
        autopilot.stop();
        autopilotToggle.checked = false;
        sim.reset();
    });

    // 4. Navigation Event Listeners
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectionId = btn.getAttribute('data-section') || btn.textContent.toLowerCase().split(' ')[0];
            // Personnel -> personnel, Missions -> missions, Stellar Map -> stellar, etc.
            // But some are different, so let's handle them specifically if needed or use data attributes.
            let targetId = sectionId;
            if (targetId === 'stellar') targetId = 'stellar'; // Stellar Map
            if (targetId === 'subspace') targetId = 'comms'; // Subspace
            
            // Re-mapping based on the index.html IDs
            const map = {
                'personnel': 'personnel',
                'missions': 'missions',
                'stellar': 'stellar',
                'bridge': 'bridge',
                'subspace': 'comms'
            };
            loadContent(map[targetId] || targetId, btn);
        });
    });

    // 5. Start Animation
    sim.animate();
});
