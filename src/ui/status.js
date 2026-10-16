// full-screen message shown until the camera is running (starts as "Loading…" in index.html)
const status = document.getElementById('status');
const message = document.getElementById('status-message');

export function showStatus(text) {
    message.textContent = text;
    status.hidden = false;
}

export function hideStatus() {
    status.hidden = true;
}
