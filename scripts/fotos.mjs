#!/usr/bin/env node
/**
 * npm run fotos
 * Convierte las fotos del iPhone (.HEIC) que haya en public/fotos/** a .jpg
 * (máx. 2000 px) usando `sips`, que viene con macOS.
 * Los .HEIC originales se mueven a fotos-originales/ (no se suben a la web).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("public/fotos");
const backup = path.resolve("fotos-originales");

if (process.platform !== "darwin") {
  console.log("Este script usa `sips` (macOS). En otra compu, convertí los HEIC a JPG a mano.");
  process.exit(0);
}

let n = 0;
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.heic$/i.test(f)) {
      const out = full.replace(/\.heic$/i, ".jpg");
      execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", "-Z", "2000", full, "--out", out], { stdio: "ignore" });
      const dest = path.join(backup, path.relative(root, full));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.renameSync(full, dest);
      n++;
      console.log("✓", path.relative(process.cwd(), out));
    }
  }
}

walk(root);
console.log(n ? `\n${n} foto(s) convertidas.` : "No había fotos .HEIC para convertir.");
