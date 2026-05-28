import { playBeep } from './utils.js';

/**
 * Handles content switching between sections
 * @param {string} sectionId - The ID of the section to load
 * @param {HTMLElement} targetButton - The button that was clicked
 */
export function loadContent(sectionId, targetButton) {
    playBeep();

    // Set active button class
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (targetButton) {
        targetButton.classList.add('active');
    }

    // Hide current content and show next (using GSAP)
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
                
                // Show new content
                gsap.fromTo(nextContent,
                    { opacity: 0, scale: 1.05 },
                    { duration: 0.4, opacity: 1, scale: 1, ease: "power2.out" }
                );
            }
        });
    } else if (!currentContent) {
        nextContent.classList.add('active');
        gsap.fromTo(nextContent,
            { opacity: 0, scale: 1.05 },
            { duration: 0.4, opacity: 1, scale: 1, ease: "power2.out" }
        );
    }
}
