// Every tunable value in one place.
export const config = {
    models: {
        wasmPath: '/wasm',
        delegate: 'GPU',
        faceLandmarker: '/models/face_landmarker.task',
        selfieSegmenter: '/models/selfie_segmenter.tflite',
    },

    motion: {
        threshold: 1.5,     // average brightness change (0–255) that counts as movement
        sampleWidth: 32,    // frames are shrunk to this size before comparing
        sampleHeight: 24,
    },

    segmentation: {
        threshold: 0.5,     // mask value (0–1) above which a pixel counts as you
    },

    // symbol options; `random` sets show random symbols (brightness only sets their color),
    // the others are ordered dark → bright and brightness picks the symbol
    charsets: {
        matrix: { chars: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789:.=*+-<>|', random: true },
        binary: { chars: '01', random: true },
        classic: { chars: '.:-=+*#%@' },
        detailed: { chars: '.\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$' },
        blocks: { chars: '░▒▓█' },
    },
    flicker: 0.02,          // share of random symbols that change each frame

    // color options: a hue (0–360), 'white' or 'rainbow'
    colors: {
        green: 120,
        amber: 38,
        cyan: 185,
        pink: 320,
        red: 0,
        purple: 270,
        white: 'white',
        rainbow: 'rainbow',
    },

    // 3D shading from the face points (see rendering/brightness.js)
    face3d: {
        featureContrast: 1.8,   // extra contrast around eyes, brows, lips
        pointReach: 0.08,       // how far each face point's shading reaches (share of face width)
    },

    // starting values for everything the settings panel can change
    defaults: {
        style: 'matrix',
        color: 'green',
        zoom: 1.5,          // output size = camera size × zoom
        contrast: 1.3,
        brightness: 0,
        depth: 0.6,         // strength of the 3D face shading (0 = flat image)
        cellSize: 10,       // character size in pixels
    },

    // slider limits for the numeric settings
    ranges: {
        zoom: { min: 0.5, max: 3, step: 0.1 },
        contrast: { min: 0.5, max: 3, step: 0.1 },
        brightness: { min: -0.5, max: 0.5, step: 0.05 },
        depth: { min: 0, max: 1.5, step: 0.1 },
        cellSize: { min: 6, max: 24, step: 1 },
    },

    debug: {
        showFaceOverlay: false,
        pointColor: 'lime',
        pointSize: 2,
        outlineColor: 'red',
        outlineWidth: 2,
    },
};
