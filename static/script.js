let RES = 20;
let ITER = 60;
let JULIA = false;
let SMOOTH = true;
let mx = 0; let my = 0; // -0.8, 0.156 for snake // 0.25 + 0.53i = freaky // 0, 0 for mandelbrot

function inCardioid(x, y) {
    const p = Math.sqrt((x - 0.25)**2 + y**2);
    return x < p - 2 * p**2 + 0.25;
}

function getColor(t) {
    const r = Math.min(255, Math.floor(255 * t * 3));
    const g = Math.min(255, Math.floor(255 * Math.max(0, (t - 0.5)) * 1.5));
    const b = Math.min(255, Math.floor(255 * Math.max(0, (t - 0.25)) * 4));
    return [r, g, b];
}

function go() {
    let ROWS = Math.floor(window.innerHeight/26) * RES;
    let COLS = Math.floor(window.innerWidth/26) * RES;

    const canvas = document.getElementById('mandelbrotCanvas');

    canvas.width = COLS;
    canvas.height = ROWS;

    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(COLS, ROWS);
    const data = imgData.data;

    const plot = new Array(ROWS).fill(0).map(() => new Array(COLS).fill(0));

    console.log("plotting...");
    let maxStat = 0;

    for (let pxIm = 0; pxIm < ROWS; pxIm++) {
        for (let pxRe = 0; pxRe < COLS; pxRe++) {
            const reProp = pxRe / COLS;
            const re = (reProp * (reMax - reMin)) + reMin;

            const imProp = pxIm / ROWS;
            const im = (imProp * (imMax - imMin)) + imMin;

            let cx, cy;
            if (JULIA) {
                cx = mx; cy = my;
                zx = re; zy = im;
            } else {
                cx = re; cy = im;
                zx = mx; zy = my;
            }
            let stat = 0;

            if ((Math.hypot(cx + 1, cy) > 0.25 && !inCardioid(cx, cy) && !JULIA) || zx != 0 || zy != 0) {
                for (let i = 0; i < ITER; i++) {
                    const newZx = zx * zx - zy * zy + cx;
                    const newZy = 2 * zx * zy + cy;
                    zx = newZx;
                    zy = newZy;

                    if (zx * zx + zy * zy > 4) {
                        if (SMOOTH) stat = i + 1 - Math.log(Math.log(Math.sqrt(zx**2 + zy**2))) / Math.log(2);
                        else stat = i;
                        break;
                    }
                }
            }

            plot[pxIm][pxRe] = stat;
            // plot[ROWS - pxIm - 1][pxRe] = stat;  // symmetry

            if (stat > maxStat) maxStat = stat;
        }
    }

    console.log("mapping...");
    // === Write colours to canvas
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const norm = plot[y][x] / maxStat;
            const [r, g, b] = getColor(norm);
            const idx = 4 * (y * COLS + x);
            data[idx + 0] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imgData, 0, 0);
    console.log("done.");
}

function updateSmall() {
    let cSmall = document.getElementById('cVal');
    let zSmall = document.getElementById('zVal');
    if (JULIA) {
        cSmall.innerHTML = `c: ${mx} + ${my}i`;
        zSmall.innerHTML = 'z: graphed';
    } else {
        cSmall.innerHTML = 'c: graphed';
        zSmall.innerHTML = `z: ${mx} + ${my}i`;
    }
}

let xSlider = document.getElementById('mx');
xSlider.addEventListener('input', () => {
    mx = parseFloat(xSlider.value);
    updateSmall();
    go();
})
xSlider.addEventListener('change', () => {
    go();
})

let ySlider = document.getElementById('my');
ySlider.addEventListener('input', () => {
    my = parseFloat(ySlider.value);
    updateSmall();
    go();
})
ySlider.addEventListener('change', () => {
    go();
})

window.onload(function () {
    go();
    updateSmall();
}());