import React, { useEffect, useMemo, useRef, useState } from 'react';

function pickNextIndex(length, currentIndex) {
  if (length <= 1) return 0;
  let next = currentIndex;
  while (next === currentIndex) next = Math.floor(Math.random() * length);
  return next;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mql) return;
    const onChange = () => setReduced(Boolean(mql.matches));
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

export default function RandomFactRoulette({
  facts = [],
  images = [],
  prefix = 'Clickeá para conocer un dato random',
  className = '',
  onFactChange,
}) {
  const safeFacts = useMemo(
    () => (Array.isArray(facts) ? facts.filter(Boolean) : []),
    [facts],
  );
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter((img) => img?.src) : []),
    [images],
  );

  const reducedMotion = usePrefersReducedMotion();
  const closeButtonRef = useRef(null);
  const settleTimeoutRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [pending, setPending] = useState({ factIndex: 0, imageIndex: 0 });
  const pendingRef = useRef({ factIndex: 0, imageIndex: 0 });
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelDurationMs, setWheelDurationMs] = useState(1200);

  const fact = safeFacts[factIndex] || '';
  const image = safeImages[imageIndex] || null;

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus?.();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if (settleTimeoutRef.current) window.clearTimeout(settleTimeoutRef.current);
    };
  }, []);

  const settleSpin = (next = pendingRef.current) => {
    setFactIndex(next.factIndex);
    setImageIndex(next.imageIndex);
    onFactChange?.(safeFacts[next.factIndex] || '');
    setSpinning(false);
    setRevealed(true);
  };

  const spin = () => {
    if (spinning) return;
    if (safeFacts.length < 1) return;

    setSpinning(true);
    setRevealed(false);

    const nextFactIndex = pickNextIndex(safeFacts.length, factIndex);
    const nextImageIndex =
      safeImages.length >= 2 ? pickNextIndex(safeImages.length, imageIndex) : 0;
    const next = { factIndex: nextFactIndex, imageIndex: nextImageIndex };
    pendingRef.current = next;
    setPending(next);

    if (reducedMotion) {
      settleSpin({ factIndex: nextFactIndex, imageIndex: nextImageIndex });
      return;
    }

    const extraTurns = 3 + Math.floor(Math.random() * 2); // 3–4 turns
    const randomOffset = Math.floor(Math.random() * 360);
    const delta = extraTurns * 360 + randomOffset;
    const duration = 1200 + Math.floor(Math.random() * 600);
    setWheelDurationMs(duration);
    setWheelRotation((prev) => prev + delta);

    if (settleTimeoutRef.current) window.clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = window.setTimeout(() => {
      setSpinning((isSpinning) => {
        if (!isSpinning) return isSpinning;
        settleSpin(next);
        return false;
      });
    }, duration + 120);
  };

  const openAndSpin = () => {
    setOpen(true);
    window.setTimeout(() => spin(), 60);
  };

  if (!safeFacts.length) return null;

  const wheelStyle = {
    transform: `rotate(${wheelRotation}deg)`,
    transition: spinning ? `transform ${wheelDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1)` : 'none',
  };

  return (
    <>
      <button
        type="button"
        onClick={openAndSpin}
        className={[
          'w-full group rounded-3xl border border-pink-100/80 bg-white/70 backdrop-blur-md',
          'px-5 py-5 shadow-[0_18px_60px_rgba(236,72,153,0.12)]',
          'hover:bg-white/80 transition-colors',
          className,
        ].join(' ')}
        aria-label={prefix}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full border border-pink-200/70 bg-white shadow-sm overflow-hidden flex-shrink-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'conic-gradient(from 90deg, rgba(236,72,153,0.9), rgba(244,114,182,0.85), rgba(251,207,232,0.95), rgba(236,72,153,0.9))',
              }}
            />
            <div className="absolute inset-2 rounded-full bg-white/85 border border-pink-100/70" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[10px] border-l-transparent border-r-transparent border-b-pink-500 drop-shadow-sm" />
          </div>

          <div className="min-w-0 text-left">
            <p className="text-[11px] uppercase tracking-[0.18em] text-pink-500/90 font-semibold">
              Ruleta random
            </p>
            <p className="mt-1 text-sm text-neutral-900 font-semibold">{prefix}</p>
            <p className="mt-2 text-[11px] text-neutral-500">Click para girar</p>
          </div>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Ruleta random"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => {
              if (settleTimeoutRef.current) window.clearTimeout(settleTimeoutRef.current);
              setSpinning(false);
              setRevealed(false);
              setOpen(false);
            }}
            aria-label="Cerrar"
          />

          <div className="relative mx-auto w-[min(720px,94vw)] max-h-[88vh]">
            <div className="relative rounded-[32px] border border-pink-100 bg-white shadow-[0_30px_120px_rgba(0,0,0,0.22)] overflow-hidden">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-pink-300/35 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-rose-300/30 blur-3xl pointer-events-none" />

              <div className="max-h-[88vh] overflow-y-auto">
                <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100/70 bg-white/70 backdrop-blur-md sticky top-0 z-20">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-pink-500/90 font-semibold">
                      Ruleta random
                    </p>
                    <p className="text-xs text-neutral-600">Tocá “Girar” y mirá qué sale.</p>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => {
                      if (settleTimeoutRef.current) window.clearTimeout(settleTimeoutRef.current);
                      setSpinning(false);
                      setRevealed(false);
                      setOpen(false);
                    }}
                    className="rounded-full border border-pink-200/70 bg-white hover:bg-pink-50 transition-colors px-3 py-1.5 text-xs font-semibold text-pink-600"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="relative px-5 py-6 sm:py-8">
                  <div className="relative mx-auto w-[min(380px,78vw)] sm:w-[min(420px,60vw)] aspect-square">
                    <div className="absolute inset-0 rounded-full border border-pink-200/70 bg-white/70 shadow-[0_26px_90px_rgba(236,72,153,0.18)]" />
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent border-b-pink-500 drop-shadow-md z-20" />

                    <div className="absolute inset-[10%] rounded-full overflow-hidden border border-pink-200/70 bg-white">
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'conic-gradient(from 90deg, rgba(236,72,153,0.92), rgba(244,114,182,0.88), rgba(251,207,232,0.98), rgba(236,72,153,0.92))',
                          ...wheelStyle,
                        }}
                        onTransitionEnd={() => {
                          if (!spinning) return;
                          if (!open) return;
                          settleSpin();
                        }}
                      />
                      <div className="absolute inset-4 rounded-full bg-white/85 border border-pink-100/70 shadow-inner" />
                      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_bottom,rgba(236,72,153,0.30)_1px,transparent_1px)] [background-size:100%_6px] pointer-events-none" />
                    </div>

                    <div className="absolute inset-0 grid place-items-center z-30 pointer-events-none">
                      <div className="rounded-full bg-white/85 border border-pink-100/80 px-4 py-2 shadow-sm">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-pink-500/90 font-semibold">
                          {spinning ? 'Girando…' : 'Lista'}
                        </p>
                      </div>
                    </div>

                    {(spinning || revealed) && (
                      <div className="absolute inset-x-0 top-3 sm:top-4 mx-auto w-[min(520px,92vw)] z-40 pointer-events-none">
                        <div className="mx-auto rounded-3xl border border-pink-100 bg-white/88 backdrop-blur-md shadow-[0_16px_60px_rgba(0,0,0,0.14)] overflow-hidden">
                          <div className="flex items-center gap-4 px-4 py-4 sm:px-5">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-pink-200/70 bg-pink-50 overflow-hidden flex-shrink-0 shadow-sm">
                              {!spinning && image?.src ? (
                                <img
                                  src={image.src}
                                  alt={fact}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-pink-200/45 to-white" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 font-semibold">
                                Un dato random mío es:
                              </p>
                              <p className="mt-1 text-sm sm:text-base font-semibold text-neutral-900">
                                {spinning ? '…' : fact}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={spin}
                      disabled={spinning}
                      className={[
                        'px-5 py-3 rounded-full font-semibold',
                        'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
                        'shadow-[0_14px_40px_rgba(236,72,153,0.25)]',
                        'transition-transform active:scale-[0.98]',
                        'disabled:opacity-60 disabled:shadow-none',
                      ].join(' ')}
                    >
                      {spinning ? 'Girando…' : 'Girar'}
                    </button>
                    <p className="text-xs text-neutral-600">{safeFacts.length} datos</p>
                  </div>

                  {!revealed && !spinning && (
                    <p className="mt-4 text-center text-xs text-neutral-500">
                      Tip: si tocás “Girar”, aparece el dato + una foto.
                    </p>
                  )}
                </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
}
