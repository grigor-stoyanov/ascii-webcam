// frames-per-second counter in the top-left corner, hidden until toggled
const counter = document.createElement('div');
counter.className = 'fps';
counter.hidden = true;
document.body.append(counter);

let frames = 0;
let since = performance.now();

// call once per drawn frame; the number updates twice a second
export function countFrame(time) {
    frames++;
    if (time - since < 500) return;
    counter.textContent = `${Math.round((frames * 1000) / (time - since))} FPS`;
    frames = 0;
    since = time;
}

export function toggleFps() {
    counter.hidden = !counter.hidden;
}
