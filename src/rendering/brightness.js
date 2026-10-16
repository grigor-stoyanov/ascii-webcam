import { FaceLandmarker } from '@mediapipe/tasks-vision';
import { config } from '../config.js';
import { settings } from '../settings.js';

const { featureContrast, pointReach } = config.face3d;

// face points that belong to eyes, irises, brows and lips
const FEATURE_POINTS = new Set([
    ...FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
    ...FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
    ...FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
    ...FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
    ...FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
    ...FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
    ...FaceLandmarker.FACE_LANDMARKS_LIPS,
].flatMap(({ start, end }) => [start, end]));

// per-cell face map, rebuilt only when the face or the grid changes
let mapFace = null;
let mapColumns = 0;
let mapRows = 0;
let closeness = null; // per cell: 0 = far side of the face … 1 = tip of the nose, -1 = not face
let isFeature = null; // per cell: 1 = eye / iris / brow / lip area

// every face point paints the cells around it; each cell keeps its nearest point's depth
function buildFaceMap(face, columns, rows) {
    closeness = new Float32Array(columns * rows).fill(-1);
    isFeature = new Uint8Array(columns * rows);
    const nearest = new Float32Array(columns * rows).fill(Infinity);

    // face points in cell coordinates, mirrored like the picture
    const points = face.map(point => ({ x: (1 - point.x) * columns, y: point.y * rows, z: point.z }));
    const xs = points.map(point => point.x);
    const zs = points.map(point => point.z);
    const minZ = Math.min(...zs);
    const zRange = Math.max(...zs) - minZ || 1;
    const reach = Math.max(1, pointReach * (Math.max(...xs) - Math.min(...xs)));

    points.forEach((point, index) => {
        const pointCloseness = 1 - (point.z - minZ) / zRange; // smaller z = closer to the camera
        const feature = FEATURE_POINTS.has(index) ? 1 : 0;
        for (let y = Math.max(0, Math.floor(point.y - reach)); y <= Math.min(rows - 1, Math.ceil(point.y + reach)); y++) {
            for (let x = Math.max(0, Math.floor(point.x - reach)); x <= Math.min(columns - 1, Math.ceil(point.x + reach)); x++) {
                const distance = (x + 0.5 - point.x) ** 2 + (y + 0.5 - point.y) ** 2;
                const cell = y * columns + x;
                if (distance > reach * reach || distance >= nearest[cell]) continue;
                nearest[cell] = distance;
                closeness[cell] = pointCloseness;
                isFeature[cell] = feature;
            }
        }
    });

    mapFace = face;
    mapColumns = columns;
    mapRows = rows;
}

// Turns sampled pixels into one level per cell: 0 = dark, 1 = bright, -1 = background.
export function computeLevels(pixels, columns, rows, face) {
    const { contrast, brightness, depth } = settings;
    if (face && (face !== mapFace || columns !== mapColumns || rows !== mapRows)) {
        buildFaceMap(face, columns, rows);
    }
    const featureBoost = 1 + (featureContrast - 1) * depth;

    const levels = new Float32Array(columns * rows);
    for (let cell = 0; cell < levels.length; cell++) {
        const i = cell * 4; // pixels are stored as R, G, B, A
        if (pixels[i + 3] < 128) { // mostly transparent = background (see rendering/mask.js)
            levels[cell] = -1;
            continue;
        }
        let level = (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255;
        level = (level - 0.5) * contrast + 0.5 + brightness;

        if (face && closeness[cell] >= 0) {
            level *= 1 + depth * (closeness[cell] - 0.5);                       // 3D: near → lighter, far → darker
            if (isFeature[cell]) level = (level - 0.5) * featureBoost + 0.5;    // eyes, brows, lips stand out
        }
        levels[cell] = Math.min(1, Math.max(0, level));
    }
    return levels;
}
