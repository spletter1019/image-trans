/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PixelColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface SubmatrixData {
  r: number[][];
  g: number[][];
  b: number[][];
  dim: number;
}

export interface InspectedPixel {
  x: number;
  y: number;
  p1: PixelColor;
  p2: PixelColor;
  pRes: PixelColor;
  sub1?: SubmatrixData;
  sub2?: SubmatrixData;
  subRes?: SubmatrixData;
}

export type ChannelMode = 'rgb' | 'r' | 'g' | 'b' | 'gray';

export interface PresetPair {
  id: string;
  title: string;
  subtitle: string;
  img1Url: string;
  img1Name: string;
  img2Url: string;
  img2Name: string;
  description: string;
}
