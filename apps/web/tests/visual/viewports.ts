/**
 * The frozen 6-viewport matrix, contracts/VISUAL-REGRESSION-CONTRACT.md.
 * Do not add, remove, or resize a viewport here without a contract
 * amendment — this file is a direct transcription, not an independent
 * decision.
 */
export interface ViewportSpec {
  readonly name: string;
  readonly width: number;
  readonly height: number;
}

export const VIEWPORT_MATRIX: readonly ViewportSpec[] = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1280x800', width: 1280, height: 800 },
  { name: 'tablet-landscape-1024x768', width: 1024, height: 768 },
  { name: 'tablet-portrait-768x1024', width: 768, height: 1024 },
  { name: 'mobile-large-430x932', width: 430, height: 932 },
  { name: 'mobile-standard-390x844', width: 390, height: 844 },
];
