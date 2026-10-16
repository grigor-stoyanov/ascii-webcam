// Turns sampled pixels into one level per cell: 0 = dark, 1 = bright, -1 = background.
export function computeLevels(pixels, columns, rows) {
    const levels = new Float32Array(columns * rows);
    for (let cell = 0; cell < levels.length; cell++) {
        const i = cell * 4; // pixels are stored as R, G, B, A
        if (pixels[i + 3] < 128) { // mostly transparent = background (see rendering/mask.js)
            levels[cell] = -1;
            continue;
        }
        levels[cell] = (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255;
    }
    return levels;
}
