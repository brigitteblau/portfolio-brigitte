/**
 * Filtros de "rollo" para la cámara del "Dejame algo".
 *
 * Cada filtro tiene:
 *  - `css`: lo que se ve en vivo en el visor (filtro CSS sobre el video)
 *  - los mismos pasos aplicados a mano sobre los píxeles de la foto final,
 *    así la foto sale igual en todos los navegadores (Safari no siempre soporta ctx.filter).
 *  - grano, viñeta, luz de rollo velado y la fecha naranja de las cámaras descartables.
 */

type Step = ["sepia" | "saturate" | "grayscale" | "hue" | "contrast" | "brightness", number];

export type Film = {
  id: string;
  name: { es: string; en: string };
  /** color de la etiqueta en el dial */
  swatch: string;
  steps: Step[];
  grain: number; // 0–40
  vignette: number; // 0–1
  leak?: string; // color de luz velada
  date?: boolean;
  /** tinte de sombras (rgb) para el look polaroid */
  shadowTint?: [number, number, number];
  fade?: number; // levanta los negros (0–60)
};

export const FILMS: Film[] = [
  {
    id: "kodak",
    name: { es: "Kodak 200", en: "Kodak 200" },
    swatch: "#f6c744",
    steps: [["sepia", 0.22], ["saturate", 1.3], ["contrast", 1.06], ["brightness", 1.05]],
    grain: 18,
    vignette: 0.35,
    fade: 14,
    date: true,
  },
  {
    id: "descartable",
    name: { es: "Descartable", en: "Disposable" },
    swatch: "#f28c38",
    steps: [["saturate", 1.45], ["contrast", 1.18], ["sepia", 0.12], ["brightness", 1.04]],
    grain: 26,
    vignette: 0.55,
    leak: "255,120,40",
    date: true,
  },
  {
    id: "polaroid",
    name: { es: "Polaroid", en: "Polaroid" },
    swatch: "#9fd3c7",
    steps: [["sepia", 0.18], ["saturate", 0.8], ["contrast", 0.88], ["brightness", 1.1], ["hue", -8]],
    grain: 12,
    vignette: 0.3,
    shadowTint: [20, 40, 38],
    fade: 34,
  },
  {
    id: "bn",
    name: { es: "Blanco y negro", en: "Black & white" },
    swatch: "#1f2128",
    steps: [["grayscale", 1], ["contrast", 1.3], ["brightness", 1.04]],
    grain: 30,
    vignette: 0.45,
  },
  {
    id: "normal",
    name: { es: "Sin filtro", en: "No filter" },
    swatch: "#fbf8ee",
    steps: [],
    grain: 0,
    vignette: 0,
  },
];

export const cssFilter = (f: Film) =>
  f.steps
    .map(([k, v]) => (k === "hue" ? `hue-rotate(${v}deg)` : `${k}(${v})`))
    .join(" ") || "none";

/* ── Matrices de color (las mismas que usa el navegador para los filtros CSS) ── */
type M = number[]; // 3x3 + offsets → 12 valores: [r0 r1 r2 ro, g0 g1 g2 go, b0 b1 b2 bo] (offset en 0–255)

const I: M = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];

function mul(a: M, b: M): M {
  // aplica b y después a
  const out: M = new Array(12).fill(0);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) out[r * 4 + c] = a[r * 4] * b[c] + a[r * 4 + 1] * b[4 + c] + a[r * 4 + 2] * b[8 + c];
    out[r * 4 + 3] = a[r * 4] * b[3] + a[r * 4 + 1] * b[7] + a[r * 4 + 2] * b[11] + a[r * 4 + 3];
  }
  return out;
}

function stepMatrix([k, v]: Step): M {
  switch (k) {
    case "sepia": {
      const a = 1 - v;
      return [0.393 + 0.607 * a, 0.769 - 0.769 * a, 0.189 - 0.189 * a, 0, 0.349 - 0.349 * a, 0.686 + 0.314 * a, 0.168 - 0.168 * a, 0, 0.272 - 0.272 * a, 0.534 - 0.534 * a, 0.131 + 0.869 * a, 0];
    }
    case "grayscale": {
      const a = 1 - v;
      return [0.2126 + 0.7874 * a, 0.7152 - 0.7152 * a, 0.0722 - 0.0722 * a, 0, 0.2126 - 0.2126 * a, 0.7152 + 0.2848 * a, 0.0722 - 0.0722 * a, 0, 0.2126 - 0.2126 * a, 0.7152 - 0.7152 * a, 0.0722 + 0.9278 * a, 0];
    }
    case "saturate":
      return [0.213 + 0.787 * v, 0.715 - 0.715 * v, 0.072 - 0.072 * v, 0, 0.213 - 0.213 * v, 0.715 + 0.285 * v, 0.072 - 0.072 * v, 0, 0.213 - 0.213 * v, 0.715 - 0.715 * v, 0.072 + 0.928 * v, 0];
    case "hue": {
      const r = (v * Math.PI) / 180;
      const c = Math.cos(r);
      const s = Math.sin(r);
      return [
        0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928, 0,
        0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.14, 0.072 - c * 0.072 - s * 0.283, 0,
        0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072, 0,
      ];
    }
    case "brightness":
      return [v, 0, 0, 0, 0, v, 0, 0, 0, 0, v, 0];
    case "contrast": {
      const o = 127.5 * (1 - v);
      return [v, 0, 0, o, 0, v, 0, o, 0, 0, v, o];
    }
  }
}

/** Aplica el filtro (colores + grano + tinte) sobre el canvas. */
export function develop(ctx: CanvasRenderingContext2D, w: number, h: number, f: Film, when = new Date()) {
  if (f.steps.length || f.grain || f.fade || f.shadowTint) {
    const m = f.steps.reduce((acc, s) => mul(stepMatrix(s), acc), I);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const fade = f.fade ?? 0;
    const t = f.shadowTint;
    const g = f.grain;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const gg = d[i + 1];
      const b = d[i + 2];
      let nr = m[0] * r + m[1] * gg + m[2] * b + m[3];
      let ng = m[4] * r + m[5] * gg + m[6] * b + m[7];
      let nb = m[8] * r + m[9] * gg + m[10] * b + m[11];
      if (fade) {
        const k = 1 - fade / 255;
        nr = nr * k + fade;
        ng = ng * k + fade;
        nb = nb * k + fade;
      }
      if (t) {
        const sh = 1 - (nr + ng + nb) / 765; // cuánto de sombra es
        nr += t[0] * sh;
        ng += t[1] * sh;
        nb += t[2] * sh;
      }
      if (g) {
        const n = (Math.random() - 0.5) * g;
        nr += n;
        ng += n;
        nb += n;
      }
      d[i] = nr;
      d[i + 1] = ng;
      d[i + 2] = nb;
    }
    ctx.putImageData(img, 0, 0);
  }

  if (f.leak) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const lg = ctx.createRadialGradient(w * 0.95, h * 0.1, 0, w * 0.95, h * 0.1, w * 0.75);
    lg.addColorStop(0, `rgba(${f.leak},.55)`);
    lg.addColorStop(1, `rgba(${f.leak},0)`);
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  if (f.vignette) {
    ctx.save();
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.hypot(w, h) / 2);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, `rgba(0,0,0,${f.vignette})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  if (f.date) {
    const yy = String(when.getFullYear()).slice(2);
    const stamp = `'${yy} ${String(when.getMonth() + 1).padStart(2, " ")} ${String(when.getDate()).padStart(2, " ")}`;
    ctx.save();
    ctx.font = `${Math.round(w * 0.062)}px VT323, ui-monospace, monospace`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.shadowColor = "rgba(255,120,30,.9)";
    ctx.shadowBlur = w * 0.012;
    ctx.fillStyle = "#ffa23a";
    ctx.fillText(stamp, w * 0.94, h * 0.955);
    ctx.restore();
  }
}
