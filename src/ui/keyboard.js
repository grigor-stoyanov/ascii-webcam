import { config } from '../config.js';
import { cycleSetting, stepSetting } from '../settings.js';
import { takeSelfie } from './selfie.js';

// shown in the settings panel
export const shortcuts = [
    ['P', 'open / close settings'],
    ['H', 'hide all controls (for streaming)'],
    ['S', 'next symbols (Shift: previous)'],
    ['C', 'next color (Shift: previous)'],
    ['+ −', 'zoom'],
    ['[ ]', 'contrast'],
    [', .', 'brightness'],
    ['F', 'fullscreen'],
    ['Space', 'take a selfie'],
];

export function setupKeyboard(panel) {
    window.addEventListener('keydown', event => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.target instanceof HTMLSelectElement) return; // let dropdowns use their own keys

        const direction = event.shiftKey ? -1 : 1;
        switch (event.key.toLowerCase()) {
            case 'p': panel.toggle(); break;
            case 'h': panel.toggleHidden(); break;
            case 's': cycleSetting('style', config.charsets, direction); break;
            case 'c': cycleSetting('color', config.colors, direction); break;
            case '+': case '=': stepSetting('zoom', 1); break;
            case '-': case '_': stepSetting('zoom', -1); break;
            case ']': stepSetting('contrast', 1); break;
            case '[': stepSetting('contrast', -1); break;
            case '.': stepSetting('brightness', 1); break;
            case ',': stepSetting('brightness', -1); break;
            case 'f': toggleFullscreen(); break;
            case ' ': takeSelfie(); break;
            default: return;
        }
        event.preventDefault();
    });
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen?.();
    }
}
