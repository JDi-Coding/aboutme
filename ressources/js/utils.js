/**
 * Stardate calculation and display
 * Based on TNG era formula
 */
export function updateStardate() {
    const now = new Date();
    // Simple calculation for TNG-style stardate
    const stardate = (now.getFullYear() - 1970) * 1000 + (now.getDay() * 100) + (now.getHours());
    const displayElement = document.getElementById('stardate');
    if (displayElement) {
        displayElement.innerText = "SD " + (stardate / 100).toFixed(1);
    }
}

/**
 * Computer Beep Sound (Web Audio API)
 */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function playBeep() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);
}
