import { config } from '../config.js';

const { threshold, sampleWidth, sampleHeight } = config.motion;

const sampleCanvas = document.createElement('canvas');
sampleCanvas.width = sampleWidth;
sampleCanvas.height = sampleHeight;
const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
let referencePixels = null;

// detects motion if the average difference in pixel values between
// the current frame and the last frame that counted as motion exceeds the threshold
export function hasMotion(video) {
    sampleCtx.drawImage(video, 0, 0, sampleWidth, sampleHeight);
    const pixels = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight).data;
    if (!referencePixels) {
        referencePixels = pixels;
        return true;
    }
    let diff = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        diff += Math.abs(pixels[i] - referencePixels[i]);
    }
    diff /= pixels.length / 4;
    if (diff > threshold) {
        referencePixels = pixels;
        return true;
    }
    return false;
}
