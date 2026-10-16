// saves what's on the canvas right now as a PNG on the device
export function takeSelfie() {
    const time = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const link = document.createElement('a');
    link.href = document.getElementById('canvas').toDataURL('image/png');
    link.download = `ascii-selfie-${time}.png`;
    link.click();
}
