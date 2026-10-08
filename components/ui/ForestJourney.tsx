'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { Pause, Play } from 'lucide-react';
import { JOURNEY_WAYPOINTS, STUDIO_PROGRESS, type JourneyScene } from '@/lib/forest-journey';

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

export function ForestJourney() {
  const pathname = usePathname();
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<JourneyScene | null>(null);
  const progress = useRef(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => true,
  );
  const isHome = pathname === '/';

  useEffect(() => {
    let frame = 0;
    let disposed = false;
    let anchors: { top: number; progress: number }[] = [];
    let elements: HTMLElement[] = [];

    function update() {
      frame = 0;
      if (disposed) return;
      let value = STUDIO_PROGRESS;
      if (isHome && anchors.length === JOURNEY_WAYPOINTS.length) {
        const position = window.scrollY + window.innerHeight * 0.3;
        value = 0;
        for (let i = 0; i < anchors.length - 1; i++) {
          if (position >= anchors[i].top) {
            const fraction = Math.min(1, Math.max(0,
              (position - anchors[i].top) / Math.max(1, anchors[i + 1].top - anchors[i].top),
            ));
            value = anchors[i].progress + fraction * (anchors[i + 1].progress - anchors[i].progress);
          }
        }
      }
      progress.current = value;
      scene.current?.setProgress(value);
    }

    function measure() {
      if (disposed) return;
      elements = JOURNEY_WAYPOINTS.map(({ id }) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      anchors = elements.map((element, index) => ({
        top: index === 0 ? window.innerHeight * 0.3 : element.getBoundingClientRect().top + window.scrollY,
        progress: JOURNEY_WAYPOINTS[index].progress,
      }));
      update();
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    // Measure only when layout changes, never in the scroll loop.
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    measure();
    elements.forEach((element) => resize.observe(element));
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      disposed = true;
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [isHome, pathname]);

  useEffect(() => {
    const container = host.current;
    if (!container || reducedMotion) return;
    let disposed = false;
    let instance: JourneyScene | undefined;

    // The renderer is a separate chunk; portfolio content renders first.
    import('@/lib/forest-scene').then(({ createForestScene }) => {
      if (disposed) return;
      try {
        instance = createForestScene(container, () => setReady(false));
        scene.current = instance;
        instance.setProgress(progress.current);
        setReady(true);
      } catch {
        // CSS illustration remains visible if WebGL is unavailable.
        setReady(false);
      }
    }).catch(() => { if (!disposed) setReady(false); });

    return () => {
      disposed = true;
      instance?.dispose();
      scene.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    scene.current?.setPaused(paused);
  }, [paused, ready, reducedMotion]);

  const animated = ready && !reducedMotion;

  return (
    <>
      <div className="forest-journey" aria-hidden="true" data-renderer={animated ? 'three' : 'fallback'}>
        <div className="forest-journey-fallback" />
        <div ref={host} className={`forest-journey-canvas ${animated ? 'is-ready' : ''}`} />
        <div className="forest-journey-scrim" />
      </div>
      {animated && (
          <button
            type="button"
            className="journey-pause"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Resume background animation' : 'Pause background animation'}
            aria-pressed={paused}
            title={paused ? 'Resume background animation' : 'Pause background animation'}
          >
            {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
          </button>
      )}
    </>
  );
}
