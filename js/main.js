document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.querySelector('.calendar-grid');
    
    // Create 24 doors
    for (let i = 1; i <= 24; i++) {
        const door = new Door(i);
        calendarGrid.appendChild(door.element);
    }

    // Add music control functionality
    const musicButton = document.getElementById('toggleMusic');
    const backgroundMusic = document.getElementById('backgroundMusic');
    let isMusicPlaying = false;

    // Set initial volume
    backgroundMusic.volume = 0.3;

    // Function to start music
    const startMusic = () => {
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            musicButton.textContent = '🔊';
        }).catch(error => {
            console.log("Audio playback failed:", error);
            isMusicPlaying = false;
            musicButton.textContent = '🔇';
        });
    };

    // Try to start music on first user interaction
    const initialStart = () => {
        startMusic();
        document.removeEventListener('click', initialStart);
    };
    document.addEventListener('click', initialStart);

    musicButton.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicButton.textContent = '🔇';
        } else {
            startMusic();
        }
        isMusicPlaying = !isMusicPlaying;
    });
}); 