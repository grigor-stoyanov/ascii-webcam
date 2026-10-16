import { FaceLandmarker } from '@mediapipe/tasks-vision';
import { config } from '../config.js';

// debug view: draws every face point and the face outline
export function drawFaceOverlay(ctx, face) {
    const { width, height } = ctx.canvas;
    const { pointColor, pointSize, outlineColor, outlineWidth } = config.debug;

    ctx.fillStyle = pointColor;
    for (const point of face) {
        ctx.fillRect(point.x * width, point.y * height, pointSize, pointSize);
    }

    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth;
    ctx.beginPath();
    for (const { start, end } of FaceLandmarker.FACE_LANDMARKS_FACE_OVAL) {
        ctx.moveTo(face[start].x * width, face[start].y * height);
        ctx.lineTo(face[end].x * width, face[end].y * height);
    }
    ctx.stroke();
}
