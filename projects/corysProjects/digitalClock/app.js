// function to update the time displayed

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clockDisplay').textContent = `${hours}:${minutes}:${seconds}`;
}

// runs updateTime() every 1000ms (every second)
setInterval(updateTime, 1000);