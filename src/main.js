import { config } from './config.js';
import { settings } from './settings.js';
import { hasMotion } from './detection/motion.js';
import { detectFace } from './detection/face.js';
import { segmentPerson } from './detection/segmentation.js';
import { applyMask } from './rendering/mask.js';
import { drawAscii } from './rendering/ascii.js';
import { drawFaceOverlay } from './rendering/faceOverlay.js';
import { createPanel } from './ui/panel.js';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// hidden work surface at camera size: camera frame + background removal
const frame = document.createElement('canvas');
const frameCtx = frame.getContext('2d', { willReadFrequently: true });

// latest detection results, reused while you sit still
let face = null;
let personMask = null;

function draw() {
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
    drawAscii(ctx, frame, face);
    if (face && config.debug.showFaceOverlay) drawFaceOverlay(ctx, face);

    requestAnimationFrame(draw);
}

createPanel();

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }) // front camera on phones
    .then(stream => { video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        frame.width = video.videoWidth;
        frame.height = video.videoHeight;
        requestAnimationFrame(draw);
    });
    })
    .catch(err => {
        alert('Error accessing camera: ' + err);
        window.close();
    });
