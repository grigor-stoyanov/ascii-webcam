import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const vision = await FilesetResolver.forVisionTasks('/wasm');
const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: '/models/face_landmarker.task', delegate: 'GPU' },
    runningMode: 'VIDEO',
    numFaces: 1,
});

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
canvas.width = 0;
canvas.height = 0;
let ctx = canvas.getContext('2d');


function draw() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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