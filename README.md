# ASCII Webcam

Turns your webcam into live ASCII art of your face on a black background, using
[MediaPipe Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker)
for face tracking. Built to be captured in OBS and streamed on Twitch.

Everything runs locally in the browser — no video ever leaves your machine.

> 🚧 Work in progress.

## Requirements

- [Node.js](https://nodejs.org/) 20+
- A webcam
- `curl` (built into Windows 10+, macOS and most Linux distros)

## Setup

```sh
npm install
npm run model   # downloads the face tracking model (~3.6 MB) into public/models/
```

`npm install` also copies MediaPipe's WASM files into `public/wasm/` (via `postinstall`).

## Usage

```sh
npm run dev
```

Open the URL it prints (usually http://localhost:5173) and allow camera access.

## Scripts

| Script            | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the dev server with live reload               |
| `npm run build`   | Build the production site into `dist/`              |
| `npm run preview` | Serve the built `dist/` folder locally              |
| `npm run model`   | Download the MediaPipe face model                   |

## Streaming with OBS

1. Run the app and open it in its own browser window.
2. In OBS, add a **Window Capture** source and pick that window.
3. Don't add your webcam to OBS as well — on Windows only one app can use it at a time.

## Project structure

```
index.html          entry page
src/main.js         bootstrap: camera + render loop
src/config.js       all tunable settings
src/detection/      reads the camera: motion, face points, person mask
src/rendering/      draws onto the canvas
src/styles/         styles
public/             static files served as-is (favicon, models)
```

## License

[MIT](LICENSE) © Grigor Stoyanov
