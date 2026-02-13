
    // 1. STARDATE CALCULATION [cite: 32]
    // Eine einfache Funktion, um ein dynamisches "TNG-Ära" Sternendatum zu erzeugen
    function updateStardate() {

    const now = new Date();
    const startYear = 2323; // TNG Start Basis
    const stardate = (now.getFullYear() - 1970) * 1000 + (now.getDay() * 100) + (now.getHours());
    document.getElementById('stardate').innerText = "SD " + (stardate / 100).toFixed(1);

}
    setInterval(updateStardate, 10000);
    updateStardate();


    // 3. UI INTERACTION & GSAP ANIMATIONS [cite: 14, 15]

    // Simulierter Computer Sound (Web Audio API) für Interaktion
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playBeep() {

    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // LCARS Beep Frequenz
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);

}

    function loadContent(sectionId) {
    playBeep();

    // Aktive Button Klasse setzen
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    // Da wir hier inline JS nutzen, suchen wir den Button, der geklickt wurde über event.target im echten Code,
    // hier simulieren wir es einfach durch Loop.
    event.target.classList.add('active');

    // Aktuellen Content ausblenden (GSAP)
    const currentContent = document.querySelector('.viewer-content.active');
    const nextContent = document.getElementById(sectionId);

    if (currentContent && currentContent !== nextContent) {
    gsap.to(currentContent, {
    duration: 0.3,
    opacity: 0,
    scale: 0.95,
    onComplete: () => {
    currentContent.classList.remove('active');
    nextContent.classList.add('active');
    // Neuen Content einblenden
    gsap.fromTo(nextContent,
{ opacity: 0, scale: 1.05 },
{ duration: 0.4, opacity: 1, scale: 1, ease: "power2.out" }
    );
}
});
} else if (!currentContent) {
    nextContent.classList.add('active');
}
}