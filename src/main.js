import { config } from './config.js';
import { hasMotion } from './detection/motion.js';
import { detectFace } from './detection/face.js';
import { segmentPerson } from './detection/segmentation.js';
import { applyMask } from './rendering/mask.js';
import { drawFaceOverlay } from './rendering/faceOverlay.js';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
canvas.width = 0;
canvas.height = 0;
let ctx = canvas.getContext('2d', { willReadFrequently: true });

// latest detection results, reused while you sit still
let face = null;
let personMask = null;

function draw() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (hasMotion(video)) {
        face = detectFace(video);
        personMask = segmentPerson(video);
    }

    if (personMask) applyMask(ctx, personMask);
    if (face && config.debug.showFaceOverlay) drawFaceOverlay(ctx, face);

    requestAnimationFrame(draw);
}


navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        requestAnimationFrame(draw);
    });
    })
    .catch(err => {
        alert('Error accessing camera: ' + err);
        window.close();
    });
