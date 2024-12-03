class Door {
    constructor(number) {
        this.number = number;
        this.element = this.createElement();
        this.isLocked = this.checkIfLocked();
        if (this.isLocked) {
            this.element.classList.add('locked');
        }
        this.createMessageOverlay();
    }

    checkIfLocked() {
        // This runs in the user's browser, getting the current time
        const montrealDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Montreal' }));
        
        // Compare with door's date
        const doorDate = new Date(Date.UTC(2024, 11, this.number));
        doorDate.setUTCHours(4, 0, 0, 0); // 00:00 Montreal time (UTC-5)
        
        return montrealDate < doorDate;
    }

    createElement() {
        const door = document.createElement('div');
        door.className = 'door';
        
        // Create left half of the door
        const leftHalf = document.createElement('div');
        leftHalf.className = 'door-half door-left';
        
        // Create right half of the door
        const rightHalf = document.createElement('div');
        rightHalf.className = 'door-half door-right';
        
        // Add number display
        const numberDisplay = document.createElement('div');
        numberDisplay.className = 'door-number';
        numberDisplay.textContent = this.number;
        door.appendChild(numberDisplay);

        const back = document.createElement('div');
        back.className = 'door-back';
        
        const link = document.createElement('a');
        link.href = 'https://nf-co.re';
        link.target = '_blank';
        
        const image = document.createElement('img');
        image.src = `assets/day${this.number}_surprise.png`;
        image.alt = `Surprise for day ${this.number}`;
        
        // Add info overlay for day 1 (Nextflow)
        if (this.number === 1) {
            const infoOverlay = document.createElement('div');
            infoOverlay.className = 'info-overlay';
            
            const infoContent = document.createElement('div');
            infoContent.className = 'info-content';
            infoContent.innerHTML = `
                <h3>Nextflow</h3>
                <p>A scalable, portable and reproducible workflow engine for running data-intensive pipelines.</p>
                <a href="https://nextflow.io" target="_blank" class="info-link">Visit nextflow.io →</a>
            `;
            
            infoOverlay.appendChild(infoContent);
            back.appendChild(infoOverlay);
        }
        
        // Add info overlay for day 2 (nf-core)
        if (this.number === 2) {
            const infoOverlay = document.createElement('div');
            infoOverlay.className = 'info-overlay';
            
            const infoContent = document.createElement('div');
            infoContent.className = 'info-content';
            infoContent.innerHTML = `
                <h3>nf-core</h3>
                <p>A community effort to collect a curated set of analysis pipelines built using Nextflow.</p>
                <a href="https://nf-co.re" target="_blank" class="info-link">Visit nf-co.re →</a>
            `;
            
            infoOverlay.appendChild(infoContent);
            back.appendChild(infoOverlay);
        }

        // Add info overlay for day 3 (Nextflow Language Server)
        if (this.number === 3) {
            const infoOverlay = document.createElement('div');
            infoOverlay.className = 'info-overlay';
            
            const infoContent = document.createElement('div');
            infoContent.className = 'info-content';
            infoContent.innerHTML = `
                <h3>VS Code Extension</h3>
                <p>Nextflow development with code completion, syntax highlighting and error detection.</p>
                <a href="https://marketplace.visualstudio.com/items?itemName=nextflow.nextflow" target="_blank" class="info-link">Get it!→</a>
            `;
            
            infoOverlay.appendChild(infoContent);
            back.appendChild(infoOverlay);
        }

        // Add info overlay for day 4 (Docker)
        if (this.number === 4) {
            const infoOverlay = document.createElement('div');
            infoOverlay.className = 'info-overlay';
            
            const infoContent = document.createElement('div');
            infoContent.className = 'info-content';
            
            // Check if content is long and needs expansion
            const content = `
                <h3>Docker</h3>
                <p>Nextflow seamlessly integrates with Docker for reproducible, isolated, and efficient workflow execution.</p>
                <a href="https://www.nextflow.io/docs/latest/container.html#docker" target="_blank" class="info-link">Learn more →</a>
            `;
            
            infoContent.innerHTML = content;
            
            // Add click handlers for expansion
            if (content.length > 200) { // Threshold for "long" content
                infoContent.classList.add('expandable');
                infoContent.addEventListener('click', (e) => {
                    if (!infoOverlay.classList.contains('expanded')) {
                        infoOverlay.classList.add('expanded');
                        e.stopPropagation();
                    }
                });
                
                // Close on click outside or close button
                document.addEventListener('click', (e) => {
                    if (infoOverlay.classList.contains('expanded') && 
                        !infoContent.contains(e.target) || 
                        e.target.closest('.info-content::after')) {
                        infoOverlay.classList.remove('expanded');
                    }
                });
            }
            
            infoOverlay.appendChild(infoContent);
            back.appendChild(infoOverlay);
        }

        image.onerror = () => {
            console.error(`Failed to load image for day ${this.number}`);
            back.textContent = `Image not found for day ${this.number}`;
        };
        
        image.onload = () => {
            console.log(`Successfully loaded image for day ${this.number}`);
        };

        link.appendChild(image);
        back.appendChild(link);

        door.appendChild(back);
        door.appendChild(leftHalf);
        door.appendChild(rightHalf);

        door.addEventListener('click', () => this.handleClick());

        return door;
    }

    handleClick() {
        if (this.isLocked) {
            this.showLockedMessage();
        } else {
            this.open();
        }
    }

    createMessageOverlay() {
        // Create message overlay if it doesn't exist
        if (!document.querySelector('.message-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'message-overlay';
            
            const messageBox = document.createElement('div');
            messageBox.className = 'message-box';
            
            const title = document.createElement('h3');
            title.textContent = '🔒 Door Locked';
            
            const message = document.createElement('p');
            message.className = 'lock-message'; // Add a class to easily update the message
            
            const button = document.createElement('button');
            button.textContent = 'OK';
            button.onclick = () => this.hideMessage();
            
            messageBox.appendChild(title);
            messageBox.appendChild(message);
            messageBox.appendChild(button);
            overlay.appendChild(messageBox);
            
            document.body.appendChild(overlay);
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hideMessage();
                }
            });
        }
    }

    showLockedMessage() {
        // Add a visual indicator that the door is locked
        this.element.classList.add('shake');
        
        // Remove the shake animation after it completes
        setTimeout(() => {
            this.element.classList.remove('shake');
        }, 820);

        // Update message text for this specific door
        const doorDate = new Date(2024, 11, this.number);
        const dateString = doorDate.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const messageElement = document.querySelector('.lock-message');
        messageElement.textContent = `This door will unlock on ${dateString}`;

        // Show custom message
        const overlay = document.querySelector('.message-overlay');
        overlay.classList.add('show');
    }

    hideMessage() {
        const overlay = document.querySelector('.message-overlay');
        overlay.classList.remove('show');
    }

    open() {
        // Add opening class first for initial animation
        this.element.classList.add('opening');
        
        // Add sound effect if you want
        this.playOpenSound();
        
        // Add the open class after a tiny delay for better animation sequencing
        setTimeout(() => {
            this.element.classList.add('open');
        }, 50);
    }

    playOpenSound() {
        // Optional: Add a satisfying sound effect when door opens
        const openSound = new Audio('assets/door-open.mp3'); // You'll need to add this sound file
        openSound.volume = 0.3;
        openSound.play().catch(err => console.log('Sound not played:', err));
    }
} 