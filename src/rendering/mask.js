import { config } from '../config.js';

// makes every pixel that isn't you transparent, so later steps can tell
// "background" apart from "dark part of you" (black hair stays visible)
export function applyMask(ctx, mask) {
    const frame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < mask.length; i++) {
        if (mask[i] < config.segmentation.threshold) {
            frame.data[i * 4 + 3] = 0; // alpha
        }
    }
    ctx.putImageData(frame, 0, 0);
}
