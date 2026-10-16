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

    // symbol options; `random` sets show random symbols (brightness only sets their color)
    charsets: {
        matrix: { chars: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789:.=*+-<>|', random: true },
    },
    flicker: 0.02,          // share of random symbols that change each frame

    // color options: a hue (0–360)
    colors: {
        green: 120,
    },

    // starting values for the live settings (see settings.js)
    defaults: {
        style: 'matrix',
        color: 'green',
        cellSize: 10,       // character size in pixels
    },

    debug: {
        showFaceOverlay: false,
        pointColor: 'lime',
        pointSize: 2,
        outlineColor: 'red',
        outlineWidth: 2,
    },
};
