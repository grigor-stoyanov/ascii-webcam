import { ImageSegmenter } from '@mediapipe/tasks-vision';
import { config } from '../config.js';
import { vision } from './mediapipe.js';

const segmenter = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: { modelAssetPath: config.models.selfieSegmenter, delegate: config.models.delegate },
    runningMode: 'VIDEO',
    outputConfidenceMasks: true,
});

// returns one value per pixel: 0 = background, 1 = you
export function segmentPerson(video) {
    const result = segmenter.segmentForVideo(video, performance.now());
    const masks = result.confidenceMasks;
    const mask = masks[masks.length - 1].getAsFloat32Array().slice();
    result.close(); // free the GPU memory held by the result
    return mask;
}
