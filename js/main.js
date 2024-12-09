document.addEventListener('DOMContentLoaded', () => {
    // ASCII art for Nextflow
    console.log("%c" + `
     %cN E X T F L O W%c  ~  v24.10.2 - build 5932
    ========================================
    🎄 nf-advent-calender v1.0.0 🎄
    `, 
    "color: #0DC09D; font-family: monospace;",
    "background: #0DC09D; color: black; font-family: monospace; padding: 2px 6px; border-radius: 3px;",
    "color: #0DC09D; font-family: monospace;");

    // Simulate pipeline execution
    setTimeout(() => {
        console.log("%cexecutor >  local (12)", "color: #888; font-family: monospace;");
    }, 1000);

    setTimeout(() => {
        console.log("%c[0a/tree1f] process > WRAP_PRESENTS (🎁)    [100%] 12 of 12 ✓", "color: #27ae60; font-family: monospace;");
    }, 2000);

    setTimeout(() => {
        console.log("%c[7b/tree2d] process > DECORATE_TREE (🎄)    [100%] 1 of 1 ✓", "color: #27ae60; font-family: monospace;");
    }, 3000);

    setTimeout(() => {
        console.log("%c[3c/santa1] process > BAKE_COOKIES (🍪)     [100%] 24 of 24 ✓", "color: #27ae60; font-family: monospace;");
    }, 4000);

    setTimeout(() => {
        console.log("%c[9d/tree3h] process > FEED_REINDEER (🦌)    [100%] 9 of 9 ✓", "color: #27ae60; font-family: monospace;");
    }, 5000);

    setTimeout(() => {
        console.log("%c[1f/santa2] process > HIDE_SECRET_MESSAGE (🤫) [100%] 1 of 1 ✓", "color: #27ae60; font-family: monospace;");
    }, 5500);

    setTimeout(() => {
        const localTime = new Date().toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        console.log("%c" + `
    Completed at: ${localTime}
    Duration    : 3s
    CPU hours   : 0.1
    Succeeded   : 47
    `, "color: #0DC09D; font-family: monospace;");
    }, 6000);

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

    // Add secret sequence detector
    const sequence = ['tree', 'tree', 'santa', 'tree', 'santa'];
    let currentSequence = [];
    let secretRevealed = false;

    // Add to top of file with other state variables
    let sequenceTimeout;

    // Add click handlers to emojis
    const treeEmoji = document.querySelector('h1').querySelector(':before');
    const santaEmoji = document.querySelector('h1').querySelector(':after');

    // Add sequence progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'sequence-progress';
    for (let i = 0; i < sequence.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'sequence-dot';
        progressContainer.appendChild(dot);
    }
    document.body.appendChild(progressContainer);

    document.querySelector('h1').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const elementWidth = rect.width;
        
        // Get the pseudo-elements
        const styles = window.getComputedStyle(e.target);
        const treeElement = e.target.querySelector(':before');
        const santaElement = e.target.querySelector(':after');
        
        if (clickX < elementWidth * 0.2) {
            currentSequence.push('tree');
            // Add animation class to tree
            e.target.style.setProperty('--tree-animation', 'emojiSquish 0.4s ease-out');
            setTimeout(() => {
                e.target.style.setProperty('--tree-animation', 'treeWiggle 3s ease-in-out infinite');
            }, 400);
        } else if (clickX > elementWidth * 0.8) {
            currentSequence.push('santa');
            // Add animation class to santa
            e.target.style.setProperty('--santa-animation', 'emojiSquishSanta 0.4s ease-out');
            setTimeout(() => {
                e.target.style.setProperty('--santa-animation', 'santaBob 3s ease-in-out infinite');
            }, 400);
        }

        // Update sequence checking
        if (currentSequence.length === sequence.length) {
            if (JSON.stringify(currentSequence) === JSON.stringify(sequence) && !secretRevealed) {
                revealSecret();
                secretRevealed = true;
            } else {
                // Visual feedback for wrong sequence
                const header = document.querySelector('h1');
                header.classList.add('sequence-error');
                setTimeout(() => header.classList.remove('sequence-error'), 500);
            }
            currentSequence = [];
        }

        // Update progress dots
        progressContainer.classList.add('active');
        const dots = progressContainer.querySelectorAll('.sequence-dot');
        dots.forEach((dot, index) => {
            if (index < currentSequence.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });

        // Clear progress after inactivity
        clearTimeout(sequenceTimeout);
        sequenceTimeout = setTimeout(() => {
            currentSequence = [];
            progressContainer.classList.remove('active');
            dots.forEach(dot => dot.classList.remove('filled'));
        }, 3000);

        // Add visual feedback
        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'click-feedback';
        feedbackEl.style.left = `${e.clientX}px`;
        feedbackEl.style.top = `${e.clientY}px`;
        document.body.appendChild(feedbackEl);
        
        setTimeout(() => feedbackEl.remove(), 1000);
    });

    function revealSecret() {
        console.log("%c🎄 You found the secret! 🎅", 
            "color: #0DC09D; font-size: 20px; font-weight: bold;");
        
        const secret = document.createElement('div');
        secret.className = 'secret-message';
        secret.innerHTML = `
            <div class="secret-content">
                <h3>🎁 You found the secret code! 🎁</h3>
                <p>For figuring it out, here is a little gift for you!</p>
                <a href="secret.html" class="secret-link">Show me my reward! →</a>
                <button class="close-button">✕</button>
            </div>
        `;
        
        document.body.appendChild(secret);
        
        // Animate the secret message in
        setTimeout(() => {
            secret.classList.add('revealed');
        }, 100);

        // Add close handler
        const closeButton = secret.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            secret.classList.remove('revealed');
            setTimeout(() => secret.remove(), 500);
        });
    }
}); 