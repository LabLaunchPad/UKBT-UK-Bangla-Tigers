/**
 * The frozen 7-viewport matrix, contracts/VISUAL-REGRESSION-CONTRACT.md
 * (original 6 + 1920x1080 per AMENDMENT 01).
 * Do not add, remove, or resize a viewport here without a contract
 * amendment — this file is a direct transcription, not an independent
 * decision.
 *
 * 1920x1080 was added to the contract on 2026-08-26 (AMENDMENT 01,
 * EV-20260826-032) but was not transcribed here until 2026-08-31, so
 * every run in between exercised six viewports against a seven-viewport
 * contract. Classified CODE_DRIFT and closed by fixing this file, never
 * by narrowing the contract (AMENDMENT 02 §1, DECISION-LEDGER VD-002).
 * The contract's reason for the row: the reference container caps at
 * 1340px, so how the layout centres and whether full-bleed sections
 * extend correctly past the container is only observable above 1440.
 */
export interface ViewportSpec {
  readonly name: string;
  readonly width: number;
  readonly height: number;
}

export const VIEWPORT_MATRIX: readonly ViewportSpec[] = [
  { name: 'desktop-xl-1920x1080', width: 1920, height: 1080 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'desktop-1280x800', width: 1280, height: 800 },
  { name: 'tablet-landscape-1024x768', width: 1024, height: 768 },
  { name: 'tablet-portrait-768x1024', width: 768, height: 1024 },
  { name: 'mobile-large-430x932', width: 430, height: 932 },
  { name: 'mobile-standard-390x844', width: 390, height: 844 },
];
