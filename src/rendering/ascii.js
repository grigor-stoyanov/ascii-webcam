import { config } from '../config.js';
import { settings } from '../settings.js';
import { computeLevels } from './brightness.js';

// one pixel per character cell
const sampleCanvas = document.createElement('canvas');
const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

// random symbol sets: every cell keeps its own symbol, so the picture doesn't turn into noise
let cellChars = [];
let cellCharset = null;

function randomChar(chars) {
    return chars[Math.floor(Math.random() * chars.length)];
}

// dark → dim, bright → almost white
function cellColor(color, level, x, time) {
    const lightness = 12 + level * 73;
    if (color === 'rainbow') return `hsl(${(x * 360 + time * 0.05) % 360}, 100%, ${lightness}%)`;
    if (color === 'white') return `hsl(0, 0%, ${lightness}%)`;
    return `hsl(${color}, 100%, ${lightness}%)`;
}

// draws the masked camera frame as characters on black
export function drawAscii(ctx, frame, face, time) {
    const { width, height } = ctx.canvas;
    const charset = config.charsets[settings.style];
    const color = config.colors[settings.color];

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

    if (charset.random) {
        if (cellChars.length !== levels.length || cellCharset !== charset) {
            cellChars = Array.from({ length: levels.length }, () => randomChar(charset.chars));
            cellCharset = charset;
        }
        for (let n = 0; n < cellChars.length * config.flicker; n++) {
            cellChars[Math.floor(Math.random() * cellChars.length)] = randomChar(charset.chars);
        }
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

            const char = charset.random
                ? cellChars[cell]
                : charset.chars[Math.round(level * (charset.chars.length - 1))];
            ctx.fillStyle = cellColor(color, level, x / columns, time);
            ctx.fillText(char, (x + 0.5) * cellWidth, (y + 0.5) * cellHeight);
        }
    }
}
