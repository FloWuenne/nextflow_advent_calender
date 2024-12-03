document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.querySelector('.calendar-grid');
    
    // Create 24 doors
    for (let i = 1; i <= 24; i++) {
        const door = new Door(i);
        calendarGrid.appendChild(door.element);
    }
}); 