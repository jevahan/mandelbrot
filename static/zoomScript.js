let reCenter = 0;  // centre of real axis
let imCenter = 0;  // centre of imaginary axis
let baseReWidth = 7;  // original width: 3.5 - (-3.5)
let baseImHeight = 4; // original height: 2 - (-2)

let aspectRatio = window.innerWidth / window.innerHeight;

let reWidth, imHeight;

if (aspectRatio >= 1) {
    imHeight = baseImHeight;
    reWidth = baseImHeight * aspectRatio;
} else {
    reWidth = baseReWidth;
    imHeight = baseReWidth / aspectRatio;
}

let reMin = reCenter - reWidth / 2;
let reMax = reCenter + reWidth / 2;
let imMin = imCenter - imHeight / 2;
let imMax = imCenter + imHeight / 2;

const zoomCanvas = document.getElementById('mandelbrotCanvas');
const zoomOverlay = document.createElement('div');
zoomOverlay.style.position = 'absolute';
zoomOverlay.style.border = '1px solid rgb(255, 255, 255)';
zoomOverlay.style.borderRadius = '10px';
zoomOverlay.style.pointerEvents = 'none';
zoomOverlay.style.transition = '0.1s ease';
zoomOverlay.style.zIndex = 10;
document.body.appendChild(zoomOverlay);

let zoomWidth = 100;
let zoomHeight = 100;

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
    const rect = zoomCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Keep box square and centered
    zoomWidth = rect.width / 4;
    zoomHeight = rect.height / 4;

    zoomOverlay.style.left = (e.clientX - zoomWidth / 2) + 'px';
    zoomOverlay.style.top = (e.clientY - zoomHeight / 2) + 'px';
    zoomOverlay.style.width = zoomWidth + 'px';
    zoomOverlay.style.height = zoomHeight + 'px';
});

document.getElementById('mandelbrotCanvas').addEventListener('click', () => {
    zoomOverlay.style.display = 'block';
    const canvasRect = zoomCanvas.getBoundingClientRect();

    const centreX = mouseX / canvasRect.width;
    const centreY = mouseY / canvasRect.height;

    const boxReWidth = (reMax - reMin) / 4;
    const boxImHeight = (imMax - imMin) / 4;

    const newReMid = reMin + (reMax - reMin) * centreX;
    const newImMid = imMin + (imMax - imMin) * centreY;

    const newReMin = newReMid - boxReWidth / 2;
    const newReMax = newReMid + boxReWidth / 2;
    const newImMin = newImMid - boxImHeight / 2;
    const newImMax = newImMid + boxImHeight / 2;

    // Get viewport centre coords
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    // Calculate translation needed to move mouse point to viewport centre after scaling
    const scale = 4; // your zoom scale

    const translateX = viewportCenterX - mouseX * scale;
    const translateY = viewportCenterY - mouseY * scale;

    // Apply transform: translate + scale
    zoomCanvas.style.transition = 'transform 1s ease';
    zoomCanvas.style.transformOrigin = '0 0'; // top-left corner
    zoomCanvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    
    zoomOverlay.style.transition = 'transform 1s ease, opacity 1s ease, border-radius 1s ease';
    zoomOverlay.style.transformOrigin = '0 0'; // top-left corner
    zoomOverlay.style.transform = `translate(${translateX/scale}px, ${translateY/scale}px) scale(${scale})`;
    zoomOverlay.style.opacity = `0`;
    zoomOverlay.style.borderRadius = `0`;
    
    let timeout = 600;
    if (ITER == 40) {
        timeout = 300;
    } else if (ITER >= 50) {
        timeout = 0;
    }
    setTimeout(() => {
        // Update zoom window coords
        reMin = newReMin;
        reMax = newReMax;
        imMin = newImMin;
        imMax = newImMax;
        
        ITER = ITER + 10;
        go();
        
        // Reset transform instantly, so no jump visible after re-render
        zoomCanvas.style.transition = 'none';
        zoomCanvas.style.transform = 'none';
        
        zoomOverlay.style.transition = '0.1s ease';
        zoomOverlay.style.transform = `none`;
        zoomOverlay.style.opacity = `1`;
        zoomOverlay.style.borderRadius = `10px`;
        
        if (aspectRatio < 1) zoomOverlay.style.display = 'none';
    }, timeout);
});