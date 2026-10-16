import { config } from './config.js';
import { settings } from './settings.js';
import { hasMotion } from './detection/motion.js';
import { detectFace } from './detection/face.js';
import { segmentPerson } from './detection/segmentation.js';
import { applyMask } from './rendering/mask.js';
import { drawAscii } from './rendering/ascii.js';
import { drawFaceOverlay } from './rendering/faceOverlay.js';
import { createPanel } from './ui/panel.js';
import { setupKeyboard } from './ui/keyboard.js';
import { countFrame } from './ui/fps.js';
import { showStatus, hideStatus } from './ui/status.js';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// hidden work surface at camera size: camera frame + background removal
const frame = document.createElement('canvas');
const frameCtx = frame.getContext('2d', { willReadFrequently: true });

// latest detection results, reused while you sit still
let face = null;
let personMask = null;

function draw(time) {
    // output size follows the zoom slider, keeping the camera's proportions
    const width = Math.round(frame.width * settings.zoom);
    const height = Math.round(frame.height * settings.zoom);
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }

    frameCtx.drawImage(video, 0, 0, frame.width, frame.height);

    if (hasMotion(video)) {
        face = detectFace(video);
        personMask = segmentPerson(video);
    }

    if (personMask) applyMask(frameCtx, personMask);
    drawAscii(ctx, frame, face, time);
    if (face && config.debug.showFaceOverlay) drawFaceOverlay(ctx, face);
    countFrame(time);

    requestAnimationFrame(draw);
}

// what to tell the user when the camera can't start
function cameraError(err) {
    switch (err.name) {
        case 'NotAllowedError': return 'Camera access was blocked. Allow it from the camera icon in the address bar, then try again.';
        case 'NotFoundError': case 'OverconstrainedError': return 'No camera found. Plug one in, then try again.';
        case 'NotReadableError': return 'Your camera is busy in another app. Close that app, then try again.';
        case 'TypeError': return 'The camera only works on https:// pages.'; // navigator.mediaDevices is missing on http
        default: return `Couldn't start the camera (${err.name}).`;
    }
}

function startCamera() {
    showStatus('Waiting for camera…');
    Promise.resolve() // so a missing navigator.mediaDevices also ends up in catch
        .then(() => navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })) // front camera on phones
        .then(stream => { video.srcObject = stream; })
        .catch(err => showStatus(cameraError(err), startCamera));
}

video.addEventListener('loadedmetadata', () => {
    frame.width = video.videoWidth;
    frame.height = video.videoHeight;
    hideStatus();
    requestAnimationFrame(draw);
});

setupKeyboard(createPanel());
startCamera();
