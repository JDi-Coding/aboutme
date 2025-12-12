document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('space-canvas');
    const ctx = canvas.getContext('2d');

    let stars = [];
    const numStars = 200; // Anzahl der Sterne
    let width, height;

    // Funktion um Canvas Größe anzupassen
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // Stern Klasse
    class Star {
        constructor() {
            this.x = Math.random() * width - width / 2;
            this.y = Math.random() * height - height / 2;
            this.z = Math.random() * width; // Tiefe
        }

        update() {
            // Bewegungsgeschwindigkeit (Z verringern = kommt näher)
            this.z -= 2;

            // Wenn Stern hinter uns ist (z <= 0), reset nach hinten
            if (this.z <= 0) {
                this.z = width;
                this.x = Math.random() * width - width / 2;
                this.y = Math.random() * height - height / 2;
            }
        }

        draw() {
            // Perspektive berechnen
            let x = (this.x / this.z) * width / 2 + width / 2;
            let y = (this.y / this.z) * height / 2 + height / 2;

            // Größe basierend auf Nähe berechnen
            let radius = (1 - this.z / width) * 3;

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Sterne initialisieren
    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }

    // Animations-Loop
    function animate() {
        // Leichte Spur hinterlassen für "Warp"-Effekt (optional)
        // ctx.fillStyle = "rgba(5, 5, 5, 0.2)";
        // ctx.fillRect(0, 0, width, height);

        // Oder clean löschen:
        ctx.fillStyle = "#050505"; // Hintergrundfarbe passend zum CSS
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    // Event Listener für Resize
    window.addEventListener('resize', () => {
        resize();
        initStars();
    });

    // Start
    resize();
    initStars();
    animate();
});