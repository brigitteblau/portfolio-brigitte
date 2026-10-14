"use client";

/**
 * Estado global del "carrete" horizontal.
 * x = cuántos px se movió el carrete hacia la izquierda.
 * Los paneles se suscriben para saber su progreso sin re-renderizar todo.
 */
type Listener = (x: number, vw: number) => void;

let x = 0;
let vw = 1440;
let flat = false; // modo vertical (movimiento reducido)
const listeners = new Set<Listener>();

export const track = {
  get x() {
    return x;
  },
  get vw() {
    return vw;
  },
  get flat() {
    return flat;
  },
  set(nx: number, nvw: number) {
    x = nx;
    vw = nvw;
    listeners.forEach((l) => l(x, vw));
  },
  setFlat(f: boolean) {
    flat = f;
    listeners.forEach((l) => l(x, vw));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    l(x, vw);
    return () => {
      listeners.delete(l);
    };
  },
};

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
