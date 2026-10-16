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

    debug: {
        showFaceOverlay: true,
        pointColor: 'lime',
        pointSize: 2,
        outlineColor: 'red',
        outlineWidth: 2,
    },
};
