import { config } from './config.js';

// live settings, changed by the panel and keyboard, read by the renderer every frame
export const settings = { ...config.defaults };

const listeners = new Set();

export function onSettingsChange(listener) {
    listeners.add(listener);
}

export function setSetting(key, value) {
    const range = config.ranges[key];
    if (range) {
        value = Math.min(range.max, Math.max(range.min, value));
        value = Number(value.toFixed(2)); // avoid 1.2000000000000002
    }
    settings[key] = value;
    listeners.forEach(listener => listener());
}

// numeric settings: move one step up (+1) or down (-1)
export function stepSetting(key, direction) {
    setSetting(key, settings[key] + direction * config.ranges[key].step);
}

// option settings: move to the next (+1) or previous (-1) option
export function cycleSetting(key, options, direction = 1) {
    const keys = Object.keys(options);
    const index = keys.indexOf(settings[key]);
    setSetting(key, keys[(index + direction + keys.length) % keys.length]);
}
