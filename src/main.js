import { config } from './config.js';
import { hasMotion } from './detection/motion.js';
import { detectFace } from './detection/face.js';
import { segmentPerson } from './detection/segmentation.js';
import { applyMask } from './rendering/mask.js';
import { drawAscii } from './rendering/ascii.js';
import { drawFaceOverlay } from './rendering/faceOverlay.js';

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
    frameCtx.drawImage(video, 0, 0, frame.width, frame.height);

    if (hasMotion(video)) {
        face = detectFace(video);
        personMask = segmentPerson(video);
    }

    if (personMask) applyMask(frameCtx, personMask);
    drawAscii(ctx, frame);
    if (face && config.debug.showFaceOverlay) drawFaceOverlay(ctx, face);

    requestAnimationFrame(draw);
}


navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }) // front camera on phones
    .then(stream => { video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        frame.width = canvas.width = video.videoWidth;
        frame.height = canvas.height = video.videoHeight;
        requestAnimationFrame(draw);
    });
    })
    .catch(err => {
        alert('Error accessing camera: ' + err);
        window.close();
    });
