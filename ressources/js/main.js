import { updateStardate } from './utils.js';
import { loadContent } from './navigation.js';
import { SpaceSim, AutoPilot } from './space-sim.js';
import { PageBuilder } from './page-builder.js';

document.addEventListener("DOMContentLoaded", () => {
    // 0. Initialize Page Builder
    const builder = new PageBuilder('en');
    
    builder.setTranslations({
        'en': {
            'nav_personnel': 'Personnel',
            'nav_missions': 'Missions',
            'nav_stellar': 'Stellar Map',
            'nav_bridge': 'Bridge',
            'nav_subspace': 'Subspace',
            'personnel_title': 'Personnel File: SC-937-0176',
            'missions_title': 'Mission Logs (Portfolio)',
            'stellar_title': 'Stellar Cartography',
            'bridge_title': 'ENGINEERING / NAVIGATION',
            'subspace_title': 'Subspace Communications',
            'label_name': 'Name',
            'label_rank': 'Rank',
            'label_assignment': 'Assignment',
            'label_species': 'Species',
            'label_status': 'Status',
            'rank_value': 'Junior Developer',
            'assignment_value': 'Web-Development',
            'species_value': 'Human',
            'status_active': 'Active Duty',
            'service_summary_title': 'Service Summary',
            'service_summary_text': 'Passionate Web Developer building the digital future.',
            'missions_intro': 'Access to archived mission reports and technical projects.',
            'project_status': 'Status',
            'access_data': 'ACCESS DATA',
            'stellar_intro': 'Interactive astrometric data [Simulation]. Click on sectors for details.',
            'sensor_scan': '// LONG RANGE SENSOR SCAN IN PROGRESS //',
            'coordinates_label': 'Known coordinates: Sector 001 (Earth), Vulcan, Deep Space 9.',
            'warp_factor': 'Warp Factor',
            'star_density': 'Star Density',
            'z_focus': 'Z-Axis Focus',
            'nebula_intensity': 'Nebula Intensity',
            'lateral_shift': 'Lateral Shift',
            'autopilot': 'Autopilot',
            'engage': 'ENGAGE',
            'reset_systems': 'RESET ALL SYSTEMS'
        },
        'de': {
            'nav_personnel': 'Personal',
            'nav_missions': 'Missionen',
            'nav_stellar': 'Sternenkarte',
            'nav_bridge': 'Brücke',
            'nav_subspace': 'Subraum',
            'personnel_title': 'Personalakte: SC-937-0176',
            'missions_title': 'Missionsprotokolle (Portfolio)',
            'stellar_title': 'Stellare Kartographie',
            'bridge_title': 'TECHNIK / NAVIGATION',
            'subspace_title': 'Subraumkommunikation',
            'label_name': 'Name',
            'label_rank': 'Rang',
            'label_assignment': 'Zuweisung',
            'label_species': 'Spezies',
            'label_status': 'Status',
            'rank_value': 'Junior Entwickler',
            'assignment_value': 'Web-Entwicklung',
            'species_value': 'Mensch',
            'status_active': 'Im Dienst',
            'service_summary_title': 'Dienstzusammenfassung',
            'service_summary_text': 'Leidenschaftlicher Web-Entwickler, der die digitale Zukunft baut.',
            'missions_intro': 'Zugriff auf archivierte Missionsberichte und technische Projekte.',
            'project_status': 'Status',
            'access_data': 'DATEN ABRUFEN',
            'stellar_intro': 'Interaktive astrometrische Daten [Simulation]. Klicken Sie auf Sektoren für Details.',
            'sensor_scan': '// LANGSTRECKEN-SENSORSCAN LÄUFT //',
            'coordinates_label': 'Bekannte Koordinaten: Sektor 001 (Erde), Vulkan, Deep Space 9.',
            'warp_factor': 'Warp-Faktor',
            'star_density': 'Sterndichte',
            'z_focus': 'Z-Achsen-Fokus',
            'nebula_intensity': 'Nebel-Intensität',
            'lateral_shift': 'Seitliche Verschiebung',
            'autopilot': 'Autopilot',
            'engage': 'AKTIVIEREN',
            'reset_systems': 'ALLE SYSTEME ZURÜCKSETZEN'
        }
    });

    builder.addSection('personnel', 'nav_personnel', (lang) => `
        <h2>${builder.t('personnel_title')}</h2>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="width: 150px; height: 150px; background: var(--lcars-blue); display: flex; align-items: center; justify-content: center; color: black; font-weight: bold;">
                [IMG ID]
            </div>
            <div>
                <p>
                    <strong>${builder.t('label_name')}:</strong> JDi-Coding <br>
                    <strong>${builder.t('label_rank')}:</strong> ${builder.t('rank_value')}<br>
                    <strong>${builder.t('label_assignment')}:</strong> ${builder.t('assignment_value')} <br>
                    <strong>${builder.t('label_species')}:</strong> ${builder.t('species_value')}<br>
                    <strong>${builder.t('label_status')}:</strong> ${builder.t('status_active')}
                </p>
            </div>
        </div>
        <h3>${builder.t('service_summary_title')}</h3>
        <p>${builder.t('service_summary_text')}</p>
        <p class="skills-container">
            <span>PHP</span>
            <span>JS</span>
            <span>C#</span>
            <span>PYTHON</span>
        </p>
    `);

    builder.addSection('missions', 'nav_missions', (lang) => `
        <h2>${builder.t('missions_title')}</h2>
        <p>${builder.t('missions_intro')}</p>
        <div class="data-grid">
            <div class="data-card">
                <h3>Project: Agens Wegweiser</h3>
                <p>Development of web application for the digitized administration of aid offers in Berlin.
                    <br><br><em>Stack: php,JS, SQL, 3rd-party-integrations</em>
                    <br><em>${builder.t('project_status')}: Deployed</em>
                </p>
            </div>
            <div class="data-card">
                <h3>Project: BarneyBot</h3>
                <p>A custom automation bot designed for community interaction and server management.
                    <br><br><em>Stack: Python, SQL, AI Integration(local)</em>
                    <br><br><em>${builder.t('project_status')}: Finished</em>
                </p>
                <button style="background:var(--lcars-light-blue); border:none; padding:5px;"><a href="https://github.com/JDi-Coding/BarneyBot" target="_blank" class="project-link">${builder.t('access_data')}</a></button>
            </div>
            <div class="data-card">
                <h3>Project: PCessentials</h3>
                <p>Essential utility scripts and configurations for optimizing and setting up PC environments.
                    <br><br><em>Stack: C#, JSON, base64, winForms(.NET)</em>
                    <br><em>${builder.t('project_status')}: development</em>
                </p>
                <button style="background:var(--lcars-light-blue); border:none; padding:5px;"><a href="https://github.com/JDi-Coding/PCessentials" target="_blank" class="project-link">${builder.t('access_data')}</a></button>
            </div>
        </div>
    `);

    builder.addSection('stellar', 'nav_stellar', (lang) => `
        <h2>${builder.t('stellar_title')}</h2>
        <p>${builder.t('stellar_intro')}</p>
        <div style="width: 100%; height: 300px; border: 1px dashed var(--lcars-light-blue); display: flex; align-items: center; justify-content: center;">
            <span style="color: var(--lcars-red); animation: blink 1s infinite;">${builder.t('sensor_scan')}</span>
        </div>
        <p>${builder.t('coordinates_label')}</p>
    `);

    builder.addSection('bridge', 'nav_bridge', (lang) => `
        <h2 class="lcars-section-title">${builder.t('bridge_title')}</h2>
        <div class="control-grid">
            <div class="control-group">
                <div class="control-label">${builder.t('warp_factor')}: <span id="current-speed" class="data-val">2.0</span></div>
                <input type="range" id="speed-control" class="lcars-slider orange" min="0.1" max="10" step="0.1" value="2.0" />
            </div>
            <div class="control-group">
                <div class="control-label">${builder.t('star_density')}: <span id="current-density" class="data-val">300</span></div>
                <input type="range" id="density-control" class="lcars-slider blue" min="100" max="1000" step="10" value="300" />
            </div>
            <div class="control-group">
                <div class="control-label">${builder.t('z_focus')}: <span id="current-focus" class="data-val">1.0</span></div>
                <input type="range" id="focus-control" class="lcars-slider purple" min="0.5" max="2" step="0.1" value="1.0" />
            </div>
            <div class="control-group">
                <div class="control-label">${builder.t('nebula_intensity')}: <span id="current-nebula-intensity" class="data-val">0.2</span></div>
                <input type="range" id="nebula-intensity-control" class="lcars-slider purple" min="0.1" max="1.0" step="0.05" value="0.2" />
            </div>
            <div class="control-group">
                <div class="control-label">${builder.t('lateral_shift')}: <span id="current-x-shift" class="data-val">0.00</span></div>
                <input type="range" id="x-shift-control" class="lcars-slider gold" min="-1.0" max="1.0" step="0.01" value="0.0" />
            </div>
            <div class="control-group">
                <div class="control-label">${builder.t('lateral_shift')}: <span id="current-y-shift" class="data-val">0.00</span></div>
                <input type="range" id="y-shift-control" class="lcars-slider gold" min="-1.0" max="1.0" step="0.01" value="0.0" />
            </div>
            <div class="control-group toggle-group">
                <div class="control-label">${builder.t('autopilot')}: <span id="autopilot-status" class="status-tag">OFFLINE</span></div><br>
                <label class="lcars-btn-toggle"><input style="opacity: 0;" type="checkbox" id="autopilot-toggle" >${builder.t('engage')}</label>
            </div>
            <div class="modal-footer-actions">
                <button class="lcars-action-btn red reset-btn">${builder.t('reset_systems')}</button>
            </div>
        </div>
    `);

    builder.addSection('comms', 'nav_subspace', (lang) => `
        <h2>${builder.t('subspace_title')}</h2>
        <br>
        <a href="https://github.com/JDi-Coding" target="_blank" class="github-link"><i class="fab fa-github"></i> GitHub</a>
    `);

    builder.init();

    // 1. Initialize Utilities
    updateStardate();
    setInterval(updateStardate, 10000);

    // 2. Setup Space Simulation
	const controls = {
		// INPUTS
		speed: document.getElementById('speed-control'),
		density: document.getElementById('density-control'),
		focus: document.getElementById('focus-control'),
		nebulaIntensity: document.getElementById('nebula-intensity-control'),
		xShift: document.getElementById('x-shift-control'),
		yShift: document.getElementById('y-shift-control'),
		autopilot: document.getElementById('autopilot-toggle'),
		reset: document.querySelector('.reset-btn'),
		// DISPLAY ELEMENTE
		displaySpeed: document.getElementById('current-speed'),
		displayDensity: document.getElementById('current-density'),
		displayFocus: document.getElementById('current-focus'),
		displayNebulaIntensity: document.getElementById('current-nebula-intensity'),
		displayXShift: document.getElementById('current-x-shift'),
		displayYShift: document.getElementById('current-y-shift')
	};

    const sim = new SpaceSim('space-canvas', controls);
    const autopilot = new AutoPilot(sim);

    // Initialize controls references and bindings
    const rebindSimulationControls = () => {
        // Re-assign references
        controls.speed = document.getElementById('speed-control');
        controls.density = document.getElementById('density-control');
        controls.focus = document.getElementById('focus-control');
        controls.nebulaIntensity = document.getElementById('nebula-intensity-control');
        controls.xShift = document.getElementById('x-shift-control');
        controls.yShift = document.getElementById('y-shift-control');
        controls.autopilot = document.getElementById('autopilot-toggle');
        controls.reset = document.querySelector('.reset-btn');
        controls.displaySpeed = document.getElementById('current-speed');
        controls.displayDensity = document.getElementById('current-density');
        controls.displayFocus = document.getElementById('current-focus');
        controls.displayNebulaIntensity = document.getElementById('current-nebula-intensity');
        controls.displayXShift = document.getElementById('current-x-shift');
        controls.displayYShift = document.getElementById('current-y-shift');

        if (!controls.speed) return; // Not on bridge section?

        // Re-bind listeners (this is a bit redundant but necessary if we re-render)
        // A better way would be to move this to a separate function called on init and on rebind
        bindControls();
    };

    const bindControls = () => {
        if (!controls.speed) return;

        controls.speed.addEventListener('input', () => {
            const val = parseFloat(controls.speed.value);
            sim.speed = val;
            controls.displaySpeed.textContent = val.toFixed(1);
        });

        controls.density.addEventListener('input', () => {
            const val = parseInt(controls.density.value);
            sim.starCount = val;
            controls.displayDensity.textContent = val;
        });

        controls.focus.addEventListener('input', () => {
            const val = parseFloat(controls.focus.value);
            sim.projectionFactor = val;
            controls.displayFocus.textContent = val.toFixed(1);
        });

        controls.nebulaIntensity.addEventListener('input', () => {
            const val = parseFloat(controls.nebulaIntensity.value);
            sim.nebulaIntensity = val;
            controls.displayNebulaIntensity.textContent = val.toFixed(2);
        });

        controls.xShift.addEventListener('input', () => {
            const val = parseFloat(controls.xShift.value);
            sim.xShift = val;
            controls.displayXShift.textContent = val.toFixed(2);
        });

        controls.yShift.addEventListener('input', () => {
            const val = parseFloat(controls.yShift.value);
            sim.yShift = val;
            controls.displayYShift.textContent = val.toFixed(2);
        });

        controls.autopilot.addEventListener('change', (e) => {
            if (e.target.checked) {
                autopilot.start();
                document.getElementById('autopilot-status').textContent = 'ENGAGED';
                document.getElementById('autopilot-status').classList.add('status-on');
            } else {
                autopilot.stop();
                document.getElementById('autopilot-status').textContent = 'OFFLINE';
                document.getElementById('autopilot-status').classList.remove('status-on');
            }
        });

        controls.reset.addEventListener('click', () => {
            sim.reset();
            controls.speed.value = 2.0;
            controls.density.value = 300;
            controls.focus.value = 1.0;
            controls.nebulaIntensity.value = 0.2;
            controls.xShift.value = 0.0;
            controls.yShift.value = 0.0;
            
            controls.displaySpeed.textContent = "2.0";
            controls.displayDensity.textContent = "300";
            controls.displayFocus.textContent = "1.0";
            controls.displayNebulaIntensity.textContent = "0.2";
            controls.displayXShift.textContent = "0.00";
            controls.displayYShift.textContent = "0.00";
            
            if (controls.autopilot.checked) {
                controls.autopilot.click();
            }
        });
    };

    const setupNavigation = () => {
        // Sidebar clicks (Navigation)
        document.querySelector('.sidebar').addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-btn');
            if (btn) {
                const sectionId = btn.getAttribute('data-section');
                builder.updatePageTitle(builder.sections[sectionId].titleKey);
                loadContent(sectionId, btn);
            }
        });

        // Language switch
        document.querySelector('.lang-switch').addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (btn) {
                const lang = btn.getAttribute('data-lang');
                
                // Update active state of lang buttons
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Switch language
                builder.setLanguage(lang);
                
                // Re-initialize simulation controls references and listeners after re-render
                rebindSimulationControls();
            }
        });
    };

    setupNavigation();
    rebindSimulationControls(); // Initial bind

    // 5. Start Animation
    sim.animate();
});
