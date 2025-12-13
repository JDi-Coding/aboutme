document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById('space-canvas');
    const ctx = canvas.getContext('2d');
    let isAutoPilotActive = false;

    const autopilotToggle = document.getElementById('autopilot-toggle');
    const autopilotStatusDisplay = document.getElementById('autopilot-status');

    // --- DOM ELEMENTS ZUM STEUERN ---
    const modal = document.getElementById('cockpit-modal');
    const openBtn = document.getElementById('open-cockpit-btn');
    const closeBtn = document.querySelector('.close-btn');
    const speedControl = document.getElementById('speed-control');
    const densityControl = document.getElementById('density-control');
    const focusControl = document.getElementById('focus-control');
    const nebulaIntensityControl = document.getElementById('nebula-intensity-control');
    const xShiftControl = document.getElementById('x-shift-control');
    const yShiftControl = document.getElementById('y-shift-control');
    const resetButton = document.querySelector('.reset-btn');

    // --- DISPLAY ELEMENTE ---
    const currentSpeedDisplay = document.getElementById('current-speed');
    const currentDensityDisplay = document.getElementById('current-density');
    const currentFocusDisplay = document.getElementById('current-focus');
    const currentNebulaIntensityDisplay = document.getElementById('current-nebula-intensity');
    const currentXShiftDisplay = document.getElementById('current-x-shift');
    const currentYShiftDisplay = document.getElementById('current-y-shift');


    let width, height;

    //global
    let xShift = parseFloat(xShiftControl.value); // NEU
    let yShift = parseFloat(yShiftControl.value); // NEU
    let speed = parseFloat(speedControl.value);
    let starCount = parseInt(densityControl.value);
    let projectionFactor = parseFloat(focusControl.value);
    let nebulaIntensity = parseFloat(nebulaIntensityControl.value);
    const nebulaCount = 15;

    let stars = [];
    let nebulas = [];

    // colors
    const starColors = ["#ffffff", "#cce6ff", "#e6ccff", "#e8e3c5"];
    const nebulaColors = [
        "rgba(20, 0, 255, [INTENSITY])",
        "rgba(188, 19, 254, [INTENSITY])",
        "rgba(0, 210, 255, [INTENSITY])"
    ];

    /**
     * The Autopilot changes the Background dynamically
     */
    class autoPilot {
        constructor() {
            this.updateInterval = 3000
            this.intervalId = null;
            this.callCount = 0;
            this.speed = 0.5;
            this.starCount = 50;
            this.projectionFactor = 0.5;
            this.nebulaIntensity = 0.5;
            this.xShift = 0.0;
            this.yShift = 0.0;

            // binds
            this.update = this.update.bind(this);
            this.animateChange = this.animateChange.bind(this);

            // Animations-Eigenschaften
            this.animation = {
                startTime: 0,
                duration: 0,
                startValues: {},
                endValues: {},
                requestId: null,
                easing: this.Easing.easeInOutCubic
            };
        }

        Easing = {
            linear: (t) => t,
            easeOutQuad: (t) => t * (2 - t),
            easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        };



        start() {
            autopilotStatusDisplay.textContent = 'ONLINE';
            autopilotStatusDisplay.classList.remove('status-off');
            autopilotStatusDisplay.classList.add('status-on');

            if (this.intervalId === null) {
                this.intervalId = setInterval(this.update, this.updateInterval);
                this.update();
            }
        }

        stop() {
            autopilotStatusDisplay.textContent = 'OFFLINE';
            autopilotStatusDisplay.classList.remove('status-on');
            autopilotStatusDisplay.classList.add('status-off');

            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            if (this.animation.requestId) {
                cancelAnimationFrame(this.animation.requestId);
                this.animation.requestId = null;
            }
        }

        update() {

            this.callCount++;

            // speed: min 0.1, max 10.0
            const targetSpeed = 0.1 + (10.0 - 0.1) * Math.random();
            // starCount: min 100, max 1000
            const targetStarCount = Math.floor(100 + (1000 - 100) * Math.random());
            // projectionFactor: min 0.5, max 2.0
            const targetProjectionFactor = 0.5 + (2.0 - 0.5) * Math.random();
            // nebulaIntensity: min 0.1, max 1.0
            const targetNebulaIntensity = 0.1 + (1.0 - 0.1) * Math.random();
            //xShift yShift (curve) min -1.0, max 1.0
            const targetXShift = (Math.random() * 2) - 1;
            const targetYShift = (Math.random() * 2) - 1;

            this.changeValue({
                speed: targetSpeed,
                starCount: targetStarCount,
                projectionFactor: targetProjectionFactor,
                nebulaIntensity: targetNebulaIntensity,
                xShift: targetXShift,
                yShift: targetYShift
            }, this.updateInterval - 300);

            console.log(`[AutoPilot] Update #${this.callCount} gestartet. Neue Ziele:`, {
                speed: targetSpeed.toFixed(2),
                starCount: targetStarCount,
                xShift: targetXShift.toFixed(2), // Log für xShift
                yShift: targetYShift.toFixed(2)  // Log für yShift
            });
        }

        setSpeed(_speed) {
            this.speed = _speed;
            speed = _speed;
        }

        setStarCount(_starCount) {
            this.starCount = _starCount;
            starCount = _starCount;
        }

        setProjectionFactor(_projectionFactor) {
            this.projectionFactor = _projectionFactor;
            projectionFactor = _projectionFactor;
        }

        setNebulaIntensity(_nebulaIntensity) {
            this.nebulaIntensity = _nebulaIntensity;
            nebulaIntensity = _nebulaIntensity;
        }

        setXShift(_xShift) {
            this.xShift = _xShift;
            xShift = _xShift;
        }
        setYShift(_yShift) {
            this.yShift = _yShift;
            yShift = _yShift;
        }


        /**
         * Ändert mehrere Werte sanft über eine bestimmte Zeit zu ihren Zielwerten.
         * @param {object} targetValues - Objekt mit {propertyName: newValue} Paaren. (z.B. {speed: 0.9})
         * @param time
         * @param easingFunction
         */
        changeValue(targetValues, time, easingFunction = this.Easing.easeInOutCubic) {

            // 1. Stoppe eine laufende Animation
            if (this.animation.requestId) cancelAnimationFrame(this.animation.requestId);

            // 2. Initialisiere die Animationseigenschaften
            this.animation.startTime = performance.now();
            this.animation.duration = time;
            this.animation.endValues = targetValues;
            this.animation.startValues = {}; // { speed: 0.5, starCount: 50, ... }
            this.animation.easing = easingFunction;

            // 3. Sammle die Startwerte für jede Zielvariable
            for (const key in targetValues) {
                // 'key' ist der Name der Eigenschaft (z.B. 'speed')

                // Lese den Startwert direkt aus der internen Statusvariable
                if (this[key] !== undefined) {

                    this.animation.startValues[key] = this[key];

                    console.log(`[Animation Start] Property: ${key}, Startwert: ${this[key]}, Zielwert: ${targetValues[key]}`);

                }
                else {
                    console.warn(`[AutoPilot] Status-Eigenschaft '${key}' nicht gefunden. Animation für diesen Wert übersprungen.`);
                }
            }

            if (Object.keys(this.animation.startValues).length === 0) {
                console.warn("[AutoPilot] Keine gültigen Startwerte gefunden. Animation wird nicht gestartet.");
                return;
            }

            // 4. Starte den Animations-Loop
            this.animation.requestId = requestAnimationFrame(this.animateChange);
        }

        animateChange(timestamp) {
            const { startTime, duration, startValues, endValues, easing } = this.animation;

            const elapsedTime = timestamp - startTime;
            let progress = Math.min(1, elapsedTime / duration);
            const easedProgress = easing(progress);

            // 1. Aktualisiere jede Variable basierend auf dem Fortschritt
            for (const key in startValues) {

                const start = startValues[key];
                const end = endValues[key];

                // Linear Interpolation: start + (end - start) * easedProgress
                const interpolatedValue = start + (end - start) * easedProgress;

                // 2. **FUNKTIONS-AUFRUF DES SETTERS**
                // Erzeuge den Namen der Setter-Funktion (z.B. 'speed' -> 'setSpeed')
                const setterFunctionName = "set" + key.charAt(0).toUpperCase() + key.slice(1);

                // Führe die Setter-Funktion über den String-Namen aus
                if (this[setterFunctionName] && typeof this[setterFunctionName] === 'function') {
                    this[setterFunctionName](interpolatedValue);
                    updateControlDisplay();

                }
                else {
                    console.error(`Setter-Funktion '${setterFunctionName}' nicht gefunden!`);
                }
            }

            // 3. Überprüfe, ob die Animation abgeschlossen ist
            if (progress < 1) {
                this.animation.requestId = requestAnimationFrame(this.animateChange);
            } else {
                this.animation.requestId = null;
                console.log(`[AutoPilot] Animation abgeschlossen. Letzte Werte gesetzt.`);
            }
        }
    }

    const autopilot = new autoPilot();

    /**
     * Background Stars
     */
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

            // FIX: Erhöhte Schrägbewegung (Parallaxen-Effekt)
            // Multiplikator von 0.2 auf 5.0 erhöht, um die Verschiebung sichtbar zu machen.
            this.x -= xShift * speed * 5.0;
            this.y -= yShift * speed * 5.0;

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

    /**
     * Background Nebular
     */
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

            // FIX: Erhöhte Schrägbewegung (langsamer als Sterne, da weiter weg)
            // Multiplikator von 0.05 auf 1.0 erhöht.
            this.x -= xShift * speed * 1.0;
            this.y -= yShift * speed * 1.0;

            if (this.z <= 1) { this.init(false); }
        }
        draw() {
            let x = (this.x / this.z) * (width / 2) * projectionFactor + (width / 2);
            let y = (this.y / this.z) * (height / 2) * projectionFactor + (height / 2);

            let scale = (1 - this.z / width);
            let drawRadius = this.radius * scale;
            if (drawRadius < 0) drawRadius = 0;

            // WICHTIG: Schutzprüfung für createRadialGradient.
            // Obwohl der ursprüngliche Fehler behoben wurde, hilft diese Prüfung, NaN-Fehler zu vermeiden.
            if (!isFinite(x) || !isFinite(y) || !isFinite(drawRadius) || drawRadius === 0) {
                return;
            }

            // Farbe basierend auf der aktuellen nebulaIntensity erstellen
            const baseColorString = nebulaColors[this.baseColorIndex];
            const color = baseColorString.replace('[INTENSITY]', nebulaIntensity.toFixed(2));

            let gradient = ctx.createRadialGradient(x, y, 0, x, y, drawRadius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, drawRadius, 0, Math.PI * 2);
            ctx.fill();

        }
    }

    function initElements() {

        stars = [];
        for (let i = 0; i < starCount; i++) stars.push(new Star());


        if (nebulas.length === 0) {
            for (let i = 0; i < nebulaCount; i++) nebulas.push(new Nebula());
        }

    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
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

    function cockpitReset(){

        isAutoPilotActive = false;
        speed = 2.0;
        starCount = 630;
        projectionFactor = 1;
        nebulaIntensity = 0.35;

        xShift = 0.0;
        yShift = 0.0;

        // reset HTML
        speedControl.value = speed;
        densityControl.value = starCount;
        focusControl.value = projectionFactor;
        nebulaIntensityControl.value = nebulaIntensity;
        xShiftControl.value = xShift;
        yShiftControl.value = yShift;
        autopilotToggle.checked = isAutoPilotActive;

        updateControlDisplay();

    }

    function updateControlDisplay() {


        currentSpeedDisplay.textContent = speed.toFixed(1);
        currentDensityDisplay.textContent = starCount;
        currentFocusDisplay.textContent = projectionFactor.toFixed(1);
        currentNebulaIntensityDisplay.textContent = nebulaIntensity.toFixed(2);
        currentXShiftDisplay.textContent = xShift.toFixed(2);
        currentYShiftDisplay.textContent = yShift.toFixed(2);

        if (isAutoPilotActive){

            autopilotStatusDisplay.textContent = 'ONLINE';
            autopilotStatusDisplay.classList.remove('status-off');
            autopilotStatusDisplay.classList.add('status-on');

        }
        else{
            autopilotStatusDisplay.textContent = 'OFFLINE';
            autopilotStatusDisplay.classList.remove('status-on');
            autopilotStatusDisplay.classList.add('status-off');
        }

    }


    window.onclick = (event) => {

        if (event.target === modal) modal.classList.remove('open');

    };

    window.addEventListener("resize", () => {

        resize();
        updateControlDisplay();

    });

    openBtn.onclick = () => { modal.classList.add('open'); };
    closeBtn.onclick = () => { modal.classList.remove('open'); };

    // speed
    speedControl.addEventListener('input', () => {

        speed = parseFloat(speedControl.value);
        currentSpeedDisplay.textContent = speed.toFixed(1);

    });

    // stars background density
    densityControl.addEventListener('input', () => {

        starCount = parseInt(densityControl.value);
        currentDensityDisplay.textContent = starCount;
        initElements();

    });

    //Zoom
    focusControl.addEventListener('input', () => {

        projectionFactor = parseFloat(focusControl.value);
        currentFocusDisplay.textContent = projectionFactor.toFixed(1);

    });

    // Nebular
    nebulaIntensityControl.addEventListener('input', () => {

        nebulaIntensity = parseFloat(nebulaIntensityControl.value);
        currentNebulaIntensityDisplay.textContent = nebulaIntensity.toFixed(2);

    });

    // X-Achse (Links/Rechts)
    xShiftControl.addEventListener('input', () => {
        xShift = parseFloat(xShiftControl.value);
        currentXShiftDisplay.textContent = xShift.toFixed(2);
        // HINWEIS: Hier müssten Sie ggf. eine Funktion aufrufen,
        // die dem AutoPilot-System signalisiert, dass sich der Wert geändert hat.
    });

    // Y-Achse (Hoch/Runter)
    yShiftControl.addEventListener('input', () => {
        yShift = parseFloat(yShiftControl.value);
        currentYShiftDisplay.textContent = yShift.toFixed(2);
        // HINWEIS: Hier müssten Sie ggf. eine Funktion aufrufen,
        // die dem AutoPilot-System signalisiert, dass sich der Wert geändert hat.
    });

    // AutoPilot Toggle
    autopilotToggle.addEventListener('change', () => {

        isAutoPilotActive = autopilotToggle.checked;
        console.log("AutoPilot Status:", isAutoPilotActive);

        if (isAutoPilotActive) autopilot.start();
        else autopilot.stop();

    });

    // reset
    resetButton.addEventListener('click', () => {

        cockpitReset()
        updateControlDisplay();
        initElements();

    });


    // simulation start
    resize();
    initElements();
    cockpitReset();
    updateControlDisplay();
    animate();



});