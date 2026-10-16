// full-screen message shown until the camera is running (starts as "Loading…" in index.html)
const status = document.getElementById('status');
const message = document.getElementById('status-message');
const retryButton = document.getElementById('status-retry');

let retryAction = null;
retryButton.addEventListener('click', () => retryAction?.());

// with `retry`, a "Try again" button calls it
export function showStatus(text, retry = null) {
    message.textContent = text;
    retryAction = retry;
    retryButton.hidden = !retry;
    status.hidden = false;
}

export function hideStatus() {
    status.hidden = true;
}
