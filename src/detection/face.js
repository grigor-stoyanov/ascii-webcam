import { FaceLandmarker } from '@mediapipe/tasks-vision';
import { config } from '../config.js';
import { vision } from './mediapipe.js';

const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: config.models.faceLandmarker, delegate: config.models.delegate },
    runningMode: 'VIDEO',
    numFaces: 1,
});

// returns the 478 face points (x, y from 0 to 1), or null when no face is found
export function detectFace(video) {
    const result = faceLandmarker.detectForVideo(video, performance.now());
    return result.faceLandmarks[0] ?? null;
}
