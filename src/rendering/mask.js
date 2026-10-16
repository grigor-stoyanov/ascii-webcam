import { config } from '../config.js';

// paints every pixel that isn't you black
export function applyMask(ctx, mask) {
    const frame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < mask.length; i++) {
        if (mask[i] < config.segmentation.threshold) {
            frame.data[i * 4] = 0;
            frame.data[i * 4 + 1] = 0;
            frame.data[i * 4 + 2] = 0;
        }
    }
    ctx.putImageData(frame, 0, 0);
}
