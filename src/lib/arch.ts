/**
 * Which Mac build somebody needs, without asking the user agent.
 *
 * The user agent lies. Safari and Chrome on Apple Silicon both report
 * "Macintosh; Intel Mac OS X 10_15_7" — measured on an M3 Pro, which called
 * itself Intel. Sniffing it would send the Intel build to the majority of
 * Macs sold since 2020, and they would download 48MB of something that cannot
 * start.
 *
 * Two things do tell the truth, so both are asked in turn:
 *
 * 1. `userAgentData.getHighEntropyValues(['architecture'])` — "arm" or "x86",
 *    authoritative, and only in Chromium. Measured "arm" on that same M3.
 * 2. The WebGL renderer string, which names the actual GPU and works in
 *    Safari: "ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Pro…)" against
 *    "ANGLE (Intel, …)" or an AMD Radeon on an Intel Mac.
 *
 * When neither answers, this returns null rather than a guess. A wrong
 * confident answer is worse than an honest question, and the page asks.
 */
export type Arch = 'arm64' | 'x64';

export async function detectMacArch(): Promise<Arch | null> {
  const data = (navigator as Navigator & {
    userAgentData?: {
      getHighEntropyValues(hints: string[]): Promise<{ architecture?: string }>;
    };
  }).userAgentData;

  try {
    const high = await data?.getHighEntropyValues(['architecture']);
    if (high?.architecture === 'arm') return 'arm64';
    if (high?.architecture === 'x86') return 'x64';
  } catch {
    // Not supported, or refused. The GPU is asked next.
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    if (gl && info) {
      const renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
      // Apple's own silicon names itself; Intel Macs name Intel or AMD, and
      // the vendor comes first, so an Apple-made Intel Mac cannot match here.
      if (/\bApple\b/i.test(renderer) && !/\bIntel\b|\bAMD\b|Radeon|NVIDIA/i.test(renderer)) {
        return 'arm64';
      }
      if (/\bIntel\b|\bAMD\b|Radeon|NVIDIA/i.test(renderer)) return 'x64';
    }
  } catch {
    // A blocked canvas, or no WebGL. Falls through to not knowing.
  }

  return null;
}
