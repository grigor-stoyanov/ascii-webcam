import './panel.css';
import { config } from '../config.js';
import { settings, setSetting, onSettingsChange } from '../settings.js';
import { shortcuts } from './keyboard.js';
import { takeSelfie } from './selfie.js';

const IDLE_DELAY = 2500; // ms without pointer movement before the settings tab fades out

const selects = [
    { key: 'style', label: 'Symbols', options: config.charsets },
    { key: 'color', label: 'Color', options: config.colors },
];

const sliders = [
    { key: 'zoom', label: 'Zoom', format: value => `${value.toFixed(1)}×` },
    { key: 'contrast', label: 'Contrast', format: value => value.toFixed(1) },
    { key: 'brightness', label: 'Brightness', format: value => `${value > 0 ? '+' : ''}${value.toFixed(2)}` },
    { key: 'depth', label: '3D depth', format: value => value.toFixed(1) },
    { key: 'cellSize', label: 'Character size', format: value => `${value}px` },
];

function el(tag, props = {}, children = []) {
    const element = Object.assign(document.createElement(tag), props);
    element.append(...children);
    return element;
}

// drop-down settings pane at the top of the screen; returns { toggle, toggleHidden }
export function createPanel() {
    const syncers = []; // functions that copy the current settings into the controls

    const controls = el('div', { className: 'panel-controls' });

    for (const { key, label, options } of selects) {
        const select = el('select', {}, Object.keys(options).map(
            value => el('option', { value, textContent: value }),
        ));
        select.addEventListener('change', () => setSetting(key, select.value));
        syncers.push(() => { select.value = settings[key]; });
        controls.append(el('label', { className: 'control' }, [
            el('span', { className: 'control-name', textContent: label }),
            select,
        ]));
    }

    for (const { key, label, format } of sliders) {
        const { min, max, step } = config.ranges[key];
        const input = el('input', { type: 'range', min, max, step });
        const value = el('output');
        input.addEventListener('input', () => setSetting(key, Number(input.value)));
        syncers.push(() => {
            input.value = settings[key];
            value.textContent = format(settings[key]);
        });
        controls.append(el('label', { className: 'control' }, [
            el('span', { className: 'control-name' }, [label, value]),
            input,
        ]));
    }

    const keys = el('dl', { className: 'panel-keys' }, shortcuts.flatMap(([key, action]) => [
        el('dt', {}, [el('kbd', { textContent: key })]),
        el('dd', { textContent: action }),
    ]));

    const body = el('div', { className: 'panel-body', id: 'panel-body', inert: true }, [controls, keys]);
    const tab = el('button', { className: 'panel-tab', type: 'button', textContent: '⚙ Settings' });
    tab.setAttribute('aria-expanded', 'false');
    tab.setAttribute('aria-controls', body.id);

    // selfie button in the top-right corner; fades and hides together with the tab
    const selfie = el('button', { className: 'selfie-button', type: 'button', textContent: '📷', title: 'Take selfie (Space)' });
    selfie.setAttribute('aria-label', 'Take selfie');
    selfie.addEventListener('click', takeSelfie);

    const panel = el('header', { className: 'panel' }, [el('div', { className: 'panel-sheet' }, [body, tab]), selfie]);
    document.body.append(panel);

    const sync = () => syncers.forEach(syncer => syncer());
    onSettingsChange(sync);
    sync();

    function toggle(open = !panel.classList.contains('open')) {
        panel.classList.toggle('open', open);
        body.inert = !open;
        tab.setAttribute('aria-expanded', String(open));
    }

    function toggleHidden() {
        const hidden = panel.classList.toggle('hidden');
        if (hidden) toggle(false);
    }

    tab.addEventListener('click', () => toggle());
    document.getElementById('canvas').addEventListener('click', () => toggle(false));

    // fade the tab out while the pointer is idle, so it doesn't sit on top of the picture
    let idleTimer;
    const wake = () => {
        document.body.classList.remove('idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => document.body.classList.add('idle'), IDLE_DELAY);
    };
    window.addEventListener('pointermove', wake);
    window.addEventListener('pointerdown', wake);
    wake();

    return { toggle, toggleHidden };
}
