from matplotlib import cm
import numpy as np
import cmath
import cv2

RES = 40
ITER = 40

ROWS = 30 * RES # IMAGINARY AXIS
COLS = 50 * RES # REAL AXIS

plot = np.zeros((ROWS, COLS))

def inCardioid(c):
    x = c.real
    y = c.imag
    p = ((x - 0.25)**2 + y**2)**0.5
    return x < p - 2*p**2 + 0.25

print('plotting...')
for pxIm in range(int(ROWS/2)):
    for pxRe in range(COLS):
        reProp = pxRe / COLS
        re = (reProp * 3) - 2
        imProp = pxIm / (ROWS)
        im = (imProp * 2) - 1
        
        c = complex(re, im)
        stat = 0

        if np.absolute(c + 1) > 0.25 and not inCardioid(c):
            z = 0

            for i in range(ITER):
                z = z**2 + c
                if np.absolute(z) > 2:
                    stat = i
                    break
        
        plot[pxIm, pxRe] = stat
        plot[-pxIm, pxRe] = stat

print('mapping...')
nPlot = plot / np.max(plot) # normalised to a range of 0 – 1
rgba = cm.inferno(nPlot)
rgb = (rgba[:, :, :3] * 255).astype(np.uint8)

cv2.imwrite('mandelbrot.png', rgb)
# cv2.imshow('mandelbrot', rgb)
# cv2.waitKey(0)