import { config } from '../config.js';
import { settings } from '../settings.js';
import { computeLevels } from './brightness.js';

// one pixel per character cell
const sampleCanvas = document.createElement('canvas');
const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

// every cell keeps its own random symbol, so the picture doesn't turn into noise
let cellChars = [];

function randomChar(chars) {
    return chars[Math.floor(Math.random() * chars.length)];
}

// draws the masked camera frame as characters on black
export function drawAscii(ctx, frame, face) {
    const { width, height } = ctx.canvas;
    const { chars } = config.charsets[settings.style];
    const hue = config.colors[settings.color];

    const columns = Math.max(1, Math.floor(width / settings.cellSize));
    const rows = Math.max(1, Math.floor(height / settings.cellSize));
    const cellWidth = width / columns;
    const cellHeight = height / rows;

    // shrink the frame to one pixel per cell, mirrored for a selfie view
    sampleCanvas.width = columns; // resizing also clears it (the masked frame is partly transparent)
    sampleCanvas.height = rows;
    sampleCtx.setTransform(-1, 0, 0, 1, columns, 0);
    sampleCtx.drawImage(frame, 0, 0, columns, rows);
    const pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
    const levels = computeLevels(pixels, columns, rows, face);

    if (cellChars.length !== levels.length) {
        cellChars = Array.from({ length: levels.length }, () => randomChar(chars));
    }
    for (let n = 0; n < cellChars.length * config.flicker; n++) {
        cellChars[Math.floor(Math.random() * cellChars.length)] = randomChar(chars);
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${cellHeight}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const cell = y * columns + x;
            const level = levels[cell];
            if (level < 0) continue; // background stays black

            ctx.fillStyle = `hsl(${hue}, 100%, ${12 + level * 73}%)`; // dark → dim, bright → almost white
            ctx.fillText(cellChars[cell], (x + 0.5) * cellWidth, (y + 0.5) * cellHeight);
        }
    }
}
