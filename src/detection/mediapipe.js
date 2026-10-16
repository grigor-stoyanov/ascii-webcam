import { FilesetResolver } from '@mediapipe/tasks-vision';
import { config } from '../config.js';

// shared WASM runtime used by every MediaPipe model
export const vision = await FilesetResolver.forVisionTasks(config.models.wasmPath);
