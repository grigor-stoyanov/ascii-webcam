import { config } from './config.js';

// live settings, read by the renderer every frame
export const settings = { ...config.defaults };
