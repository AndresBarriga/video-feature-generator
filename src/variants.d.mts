export const SLIDE_SECONDS: number;
export const totalSeconds: (cfg: { scenes: { type: string; seconds: number; transitionIn?: string }[] }) => number;
export const variantNames: (raw: { variants?: Record<string, unknown> }) => string[];
export const applyVariant: (raw: any, opts?: { variant?: string; format?: string }) => any;
