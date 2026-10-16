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

    // 3D shading from the face points (see rendering/brightness.js)
    face3d: {
        featureContrast: 1.8,   // extra contrast around eyes, brows, lips
        pointReach: 0.08,       // how far each face point's shading reaches (share of face width)
    },

    // starting values for the live settings (see settings.js)
    defaults: {
        style: 'matrix',
        color: 'green',
        contrast: 1.3,
        brightness: 0,
        depth: 0.6,         // strength of the 3D face shading (0 = flat image)
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
