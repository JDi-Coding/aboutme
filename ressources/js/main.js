document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('space-canvas');
    const ctx = canvas.getContext('2d');

    // --- DOM ELEMENTS ZUM STEUERN ---
    const modal = document.getElementById('cockpit-modal');
    const openBtn = document.getElementById('open-cockpit-btn');
    const closeBtn = document.querySelector('.close-btn');
    const speedControl = document.getElementById('speed-control');
    const densityControl = document.getElementById('density-control');
    const focusControl = document.getElementById('focus-control');
    const nebulaIntensityControl = document.getElementById('nebula-intensity-control');
    const resetButton = document.querySelector('.reset-btn');

    // --- DISPLAY ELEMENTE ---
    const currentSpeedDisplay = document.getElementById('current-speed');
    const currentDensityDisplay = document.getElementById('current-density');
    const currentFocusDisplay = document.getElementById('current-focus');
    const currentNebulaIntensityDisplay = document.getElementById('current-nebula-intensity');


    let width, height;

    // --- GLOBALE ZUSTÄNDE (AUS CONTROLS GELADEN) ---
    let speed = parseFloat(speedControl.value);
    let starCount = parseInt(densityControl.value);
    let projectionFactor = parseFloat(focusControl.value); // NEU: Kontrolliert den Zoom/Fokus
    let nebulaIntensity = parseFloat(nebulaIntensityControl.value); // NEU: Kontrolliert die Transparenz/Deckkraft der Nebel
    const nebulaCount = 15;

    // Arrays
    let stars = [];
    let nebulas = [];

    // Farben
    const starColors = ["#ffffff", "#cce6ff", "#e6ccff", "#e8e3c5"];
    const nebulaColors = [
        "rgba(20, 0, 255, [INTENSITY])",   // Deep Blue
        "rgba(188, 19, 254, [INTENSITY])", // Neon Purple
        "rgba(0, 210, 255, [INTENSITY])"   // Cyan Glow
    ];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // --- KLASSE: STERN ---
    class Star {
        constructor() { this.init(true); }
        init(randomZ = false) {
            this.x = (Math.random() - 0.5) * width * 2;
            this.y = (Math.random() - 0.5) * height * 2;
            this.z = randomZ ? Math.random() * width : width;
            this.color = starColors[Math.floor(Math.random() * starColors.length)];
            this.size = Math.random() * 2;
        }
        update() {
            this.z -= speed * 2;
            if (this.z <= 1) { this.init(false); }
        }
        draw() {
            // Projektion wird durch projectionFactor skaliert
            let x = (this.x / this.z) * (width / 2) * projectionFactor + (width / 2);
            let y = (this.y / this.z) * (height / 2) * projectionFactor + (height / 2);

            let radius = (1 - this.z / width) * this.size;
            if (radius < 0) radius = 0;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // --- KLASSE: NEBEL ---
    class Nebula {
        constructor() { this.init(true); }
        init(randomZ = false) {
            this.x = (Math.random() - 0.5) * width * 1.5;
            this.y = (Math.random() - 0.5) * height * 1.5;
            this.z = randomZ ? Math.random() * width : width;
            this.baseColorIndex = Math.floor(Math.random() * nebulaColors.length);
            this.radius = 100 + Math.random() * 300;
        }
        update() {
            this.z -= speed * 0.45;
            if (this.z <= 1) { this.init(false); }
        }
        draw() {
            let x = (this.x / this.z) * (width / 2) * projectionFactor + (width / 2);
            let y = (this.y / this.z) * (height / 2) * projectionFactor + (height / 2);

            let scale = (1 - this.z / width);
            let drawRadius = this.radius * scale;
            if (drawRadius < 0) drawRadius = 0;

            // Farbe basierend auf der aktuellen nebulaIntensity erstellen
            const baseColorString = nebulaColors[this.baseColorIndex];
            const color = baseColorString.replace('[INTENSITY]', nebulaIntensity.toFixed(2));

            let gradient = ctx.createRadialGradient(x, y, 0, x, y, drawRadius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, "rgba(0,0,0,0)"); // Muss immer transparent enden

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, drawRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Funktion zum Neu-Initialisieren der Sterne bei Dichteänderung
    function initElements() {
        stars = [];
        for (let i = 0; i < starCount; i++) stars.push(new Star());

        // Nebel müssen nicht neu initialisiert werden, nur ihre Anzahl ist fest
        if (nebulas.length === 0) {
            for (let i = 0; i < nebulaCount; i++) nebulas.push(new Nebula());
        }
    }

    function animate() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';

        nebulas.forEach(nebula => {
            nebula.update();
            nebula.draw();
        });

        ctx.globalCompositeOperation = 'source-over';

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    // --- COCKPIT STEUERUNGS-LOGIK ---

    function updateControlDisplay() {
        currentSpeedDisplay.textContent = speed.toFixed(1);
        currentDensityDisplay.textContent = starCount;
        currentFocusDisplay.textContent = projectionFactor.toFixed(1);
        currentNebulaIntensityDisplay.textContent = nebulaIntensity.toFixed(2);
    }

    // Modale Pop-up Steuerung
    // Modale Pop-up Steuerung
    openBtn.onclick = () => { modal.classList.add('open'); }; // Fügt Klasse 'open' hinzu

    // Klasse 'open' entfernen
    closeBtn.onclick = () => { modal.classList.remove('open'); };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('open'); // Schließt bei Klick auf Overlay
        }
    };

    // Geschwindigkeit
    speedControl.addEventListener('input', () => {
        speed = parseFloat(speedControl.value);
        currentSpeedDisplay.textContent = speed.toFixed(1);
    });

    // Sterndichte
    densityControl.addEventListener('input', () => {
        starCount = parseInt(densityControl.value);
        currentDensityDisplay.textContent = starCount;
        initElements(); // Neuinitialisierung der Sterne bei Dichteänderung
    });

    // Fokus/Zoom
    focusControl.addEventListener('input', () => {
        projectionFactor = parseFloat(focusControl.value);
        currentFocusDisplay.textContent = projectionFactor.toFixed(1);
    });

    // Nebel-Intensität
    nebulaIntensityControl.addEventListener('input', () => {
        nebulaIntensity = parseFloat(nebulaIntensityControl.value);
        currentNebulaIntensityDisplay.textContent = nebulaIntensity.toFixed(2);
    });

    // Reset Funktion
    resetButton.addEventListener('click', () => {
        // Setze HTML-Werte zurück
        speedControl.value = 2.0;
        densityControl.value = 300;
        focusControl.value = 1.0;
        nebulaIntensityControl.value = 0.2;

        // Setze JS-Variablen zurück
        speed = 2.0;
        starCount = 300;
        projectionFactor = 1.0;
        nebulaIntensity = 0.2;

        updateControlDisplay();
        initElements(); // Wichtig, um die Sternenzahl anzupassen
    });


    // Start der Simulation
    resize();
    initElements();
    updateControlDisplay();
    animate();
});