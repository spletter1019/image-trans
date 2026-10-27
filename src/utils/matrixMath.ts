/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChannelMode, PixelColor, SubmatrixData } from '../types';

/**
 * Blends two ImageData arrays using the linear combination formula:
 * M_C = (1 - k) * M_1 + k * M_2
 */
export function blendImageData(
  data1: ImageData,
  data2: ImageData,
  k: number,
  channelMode: ChannelMode = 'rgb'
): ImageData {
  const width = data1.width;
  const height = data1.height;
  const output = new ImageData(width, height);
  const d1 = data1.data;
  const d2 = data2.data;
  const out = output.data;

  const w1 = 1 - k;
  const w2 = k;
  const totalPixels = width * height;

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;

    // Linear combination for R, G, B channels
    let r = Math.round(w1 * d1[idx] + w2 * d2[idx]);
    let g = Math.round(w1 * d1[idx + 1] + w2 * d2[idx + 1]);
    let b = Math.round(w1 * d1[idx + 2] + w2 * d2[idx + 2]);
    let a = Math.round(w1 * d1[idx + 3] + w2 * d2[idx + 3]);

    // Clamping to [0, 255]
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    a = Math.max(0, Math.min(255, a));

    // Handle channel modes for educational observation
    if (channelMode === 'r') {
      g = 0;
      b = 0;
    } else if (channelMode === 'g') {
      r = 0;
      b = 0;
    } else if (channelMode === 'b') {
      r = 0;
      g = 0;
    } else if (channelMode === 'gray') {
      // Standard Luma formula from textbook p.94: L = 0.299R + 0.587G + 0.114B
      const luma = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      r = luma;
      g = luma;
      b = luma;
    }

    out[idx] = r;
    out[idx + 1] = g;
    out[idx + 2] = b;
    out[idx + 3] = a;
  }

  return output;
}

/**
 * Gets a single pixel color at (x, y)
 */
export function getPixel(imgData: ImageData, x: number, y: number): PixelColor {
  const clampX = Math.max(0, Math.min(imgData.width - 1, Math.floor(x)));
  const clampY = Math.max(0, Math.min(imgData.height - 1, Math.floor(y)));
  const idx = (clampY * imgData.width + clampX) * 4;
  return {
    r: imgData.data[idx],
    g: imgData.data[idx + 1],
    b: imgData.data[idx + 2],
    a: imgData.data[idx + 3],
  };
}

/**
 * Extracts a square submatrix of size `dim` centered around (cx, cy)
 */
export function extractSubmatrix(
  imgData: ImageData,
  cx: number,
  cy: number,
  dim: number = 3
): SubmatrixData {
  const half = Math.floor(dim / 2);
  const r: number[][] = [];
  const g: number[][] = [];
  const b: number[][] = [];

  for (let dy = -half; dy <= half; dy++) {
    const rowR: number[] = [];
    const rowG: number[] = [];
    const rowB: number[] = [];
    for (let dx = -half; dx <= half; dx++) {
      const px = Math.max(0, Math.min(imgData.width - 1, Math.floor(cx + dx)));
      const py = Math.max(0, Math.min(imgData.height - 1, Math.floor(cy + dy)));
      const idx = (py * imgData.width + px) * 4;
      rowR.push(imgData.data[idx]);
      rowG.push(imgData.data[idx + 1]);
      rowB.push(imgData.data[idx + 2]);
    }
    r.push(rowR);
    g.push(rowG);
    b.push(rowB);
  }

  return { r, g, b, dim };
}

/**
 * Draws an Image object to an offscreen canvas resized to target width & height,
 * and returns its ImageData.
 */
export function getImageDataFromElement(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas context could not be created');
  }

  // Draw image scaled to fit dimensions cleanly
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

/**
 * Creates a synthetic checkerboard pattern for mathematical demonstration
 */
export function createSyntheticCheckerboard(
  width: number,
  height: number,
  colorA: [number, number, number],
  colorB: [number, number, number],
  gridSize: number = 4
): ImageData {
  const imgData = new ImageData(width, height);
  const cellW = width / gridSize;
  const cellH = height / gridSize;

  for (let y = 0; y < height; y++) {
    const gy = Math.floor(y / cellH);
    for (let x = 0; x < width; x++) {
      const gx = Math.floor(x / cellW);
      const isEven = (gx + gy) % 2 === 0;
      const color = isEven ? colorA : colorB;
      const idx = (y * width + x) * 4;
      imgData.data[idx] = color[0];
      imgData.data[idx + 1] = color[1];
      imgData.data[idx + 2] = color[2];
      imgData.data[idx + 3] = 255;
    }
  }
  return imgData;
}
