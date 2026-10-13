// Preserve detail through startup and scheduling hiccups, while leaving time
// for the rest of the page within a 60 Hz frame. Resolution can recover later.
export function createRenderQuality(maxPixelRatio: number, gpuTiming: boolean) {
  const budget = 1000 / 60;
  const minimum = Math.min(0.75, maxPixelRatio);
  let pixelRatio = maxPixelRatio;
  let warmupUntil = 0, changedAt = -Infinity;
  let work = 0, gap = budget, gpu: number | undefined;
  let pressure = 0, headroom = 0;

  function reset(time: number) {
    warmupUntil = time + 2500;
    work = 0; gap = budget; gpu = undefined;
    pressure = 0; headroom = 0;
  }

  return {
    reset,
    invalidateGpu() { gpu = undefined; pressure = 0; headroom = 0; },
    sample(time: number, workMs: number, frameGapMs: number, gpuMs?: number) {
      if (time < warmupUntil) return;
      work += (Math.min(workMs, 100) - work) * 0.05;
      gap += (Math.min(frameGapMs, 100) - gap) * 0.05;
      if (gpuMs !== undefined) gpu = gpu === undefined ? gpuMs : gpu + (gpuMs - gpu) * 0.35;

      // GPU queries distinguish expensive rendering from unrelated RAF delays.
      // Without that extension, only substantial sustained delays are a fallback.
      const fallbackPressure = !gpuTiming && gap > budget * 1.35 && work > budget * 0.35;
      const struggling = work > budget * 0.88 || (gpu !== undefined && gpu > budget * 0.9) || fallbackPressure;
      const spare = work < budget * 0.55 && gap < budget * 1.08
        && (gpuTiming ? gpu !== undefined && gpu < budget * 0.65 : true);
      pressure = struggling ? pressure + 1 : Math.max(0, pressure - 2);
      headroom = spare ? headroom + 1 : 0;

      let next = pixelRatio;
      if (pressure >= 90 && time - changedAt >= 3000) next = Math.max(minimum, pixelRatio - 0.2);
      else if (headroom >= 300 && time - changedAt >= 8000) next = Math.min(maxPixelRatio, pixelRatio + 0.1);
      if (Math.abs(next - pixelRatio) < 0.001) return;

      pixelRatio = Math.round(next * 100) / 100;
      changedAt = time; reset(time);
      return pixelRatio;
    },
  };
}
