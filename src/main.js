import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const MOTION_THRESHOLD = 1.5;
const vision = await FilesetResolver.forVisionTasks('/wasm');
const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: '/models/face_landmarker.task', delegate: 'GPU' },
    runningMode: 'VIDEO',
    numFaces: 1,
});
let faceResults = null;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const motionCanvas = document.createElement('canvas');
motionCanvas.width = 32
motionCanvas.height = 24
canvas.width = 0;
canvas.height = 0;
let ctx = canvas.getContext('2d');
let motionCtx = motionCanvas.getContext('2d');
let referencePixels = null;

// detects motion if the average difference in pixel,
// values between the current frame and the previous frame exceeds a threshold
function hasMotion() {
    motionCtx.drawImage(video, 0, 0, motionCanvas.width, motionCanvas.height);
    const imageData = motionCtx.getImageData(0, 0, motionCanvas.width, motionCanvas.height).data;
    if (!referencePixels) {
        referencePixels = imageData;
        return true;
    }
    let diff = 0;
    for (let i = 0; i < imageData.length; i += 4) {
        diff += Math.abs(imageData[i] - referencePixels[i]);
    }
    diff /= imageData.length / 4;
    if (diff > MOTION_THRESHOLD) {
        referencePixels = imageData;
        return true;
    }
    return false;
}

function draw() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if(hasMotion()){
        faceResults = faceLandmarker.detectForVideo(video, performance.now())
    }
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