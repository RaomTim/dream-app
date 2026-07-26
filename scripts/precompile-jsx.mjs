#!/usr/bin/env node
/**
 * precompile-jsx.mjs — 2026-04-29 (Yeshua)
 *
 * Précompile tous les `public/v12/*.jsx` en `.js` via esbuild,
 * AVANT le build Next.js (script `prebuild`).
 *
 * Pourquoi : `public/v12/index.html` charge ~30 fichiers `.jsx` via
 * `<script type="text/babel" data-presets="env,react">` et compte sur
 * `@babel/standalone@7.29.0` (3MB) pour les transformer côté client.
 * Sur mobile (iPhone milieu de gamme, Android entry-level), cette
 * transformation prend 6-12 secondes, pendant lesquelles l'écran reste
 * noir. Pire : sur certains devices iOS Safari, allouer 30 transformations
 * AST simultanées fait crash le tab silencieusement.
 *
 * Solution : pré-transformer les .jsx en .js statiques, servis tels quels
 * par Next.js depuis `/public/v12-built/`. Plus de Babel côté client.
 * Gain : 6-10 secondes de boot mobile, pas de risque de crash.
 *
 * Préserve la sémantique :
 *  - `/* global React *\/` reste valide (React UMD est global window.React)
 *  - Pas de bundling : chaque .jsx → un .js indépendant (1:1)
 *  - JSX classique (`React.createElement`), target ES2018 (iOS Safari 12+)
 *  - Sourcemaps inline pour debug si besoin
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "public", "v12");
const OUT_DIR = path.join(ROOT, "public", "v12-built");

async function ensureEsbuild() {
  try {
    const mod = await import("esbuild");
    return mod;
  } catch (err) {
    console.error("[precompile-jsx] esbuild non trouvé. Ajoute-le en devDep :");
    console.error("  npm install --save-dev esbuild@^0.24.0");
    process.exit(1);
  }
}

async function main() {
  const esbuild = await ensureEsbuild();

  // 1. Liste tous les .jsx du dossier source
  const allFiles = await fs.readdir(SRC_DIR);
  const jsxFiles = allFiles.filter(f => f.endsWith(".jsx"));

  if (jsxFiles.length === 0) {
    console.log("[precompile-jsx] aucun .jsx trouvé dans public/v12/, rien à faire.");
    return;
  }

  console.log(`[precompile-jsx] compilation de ${jsxFiles.length} fichiers .jsx → .js`);

  // 2. (Re)crée le dossier de sortie. On tente un rm récursif mais on
  // tolère EPERM (sandboxes/CI immutables) — fs.writeFile écrase de toute façon.
  try {
    await fs.rm(OUT_DIR, { recursive: true, force: true });
  } catch (err) {
    if (err && err.code !== "EPERM" && err.code !== "ENOENT") throw err;
  }
  await fs.mkdir(OUT_DIR, { recursive: true });

  // 3. Compile chaque .jsx en .js via esbuild (transform, pas bundle)
  const t0 = Date.now();
  const results = await Promise.all(jsxFiles.map(async (file) => {
    const srcPath = path.join(SRC_DIR, file);
    const outPath = path.join(OUT_DIR, file.replace(/\.jsx$/, ".js"));
    const source = await fs.readFile(srcPath, "utf8");
    try {
      const result = await esbuild.transform(source, {
        loader: "jsx",
        jsx: "transform",         // React.createElement(...) — pas le runtime auto
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
        target: "es2018",         // iOS Safari 12+, Chrome Android 70+
        sourcemap: "inline",      // debug-friendly
        sourcefile: file,
      });
      await fs.writeFile(outPath, result.code, "utf8");
      return { file, ok: true, bytes: result.code.length };
    } catch (err) {
      return { file, ok: false, error: err.message };
    }
  }));

  const elapsed = Date.now() - t0;
  const failed = results.filter(r => !r.ok);
  const totalBytes = results.filter(r => r.ok).reduce((s, r) => s + r.bytes, 0);

  if (failed.length > 0) {
    console.error(`[precompile-jsx] ${failed.length} fichier(s) en erreur :`);
    failed.forEach(f => console.error(`  ${f.file} : ${f.error}`));
    process.exit(1);
  }

  console.log(`[precompile-jsx] ${results.length} fichiers compilés en ${elapsed}ms (${(totalBytes / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error("[precompile-jsx] erreur fatale :", err);
  process.exit(1);
});
