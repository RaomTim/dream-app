/**
 * scripts/mirror-said-render.mjs
 * ───────────────────────────────
 * Écrit `APERCU-MIROIR-CE-QUE-JEN-AI-DIT.html` à partir de
 * `_mirror-said-threads.json`, produit par `mirror-said-preview.mjs`.
 *
 * ⚠️ AUCUNE PHRASE DE TIM N'EST SAISIE À LA MAIN DANS CE FICHIER. Tout ce qui
 * est entre guillemets dans l'aperçu vient de la base, par le moteur, sans
 * retouche. C'est la seule façon pour lui de se reconnaître — ou de dire non.
 *
 * Tokens : copie fidèle de `src/lib/dream-design.ts` (nuit bleue, D1).
 * Yeshua (Opus, G2), 2026-07-26.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_mirror-said-threads.json'), 'utf8'))

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
const monthYear = (iso) => { const d = new Date(iso); return `${MOIS[d.getMonth()]} ${d.getFullYear()}` }
const fullDate = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}` }

function gapLabel(a, b) {
  const m = Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24 * 30.44))
  if (m < 1) return 'le même mois'
  if (m < 12) return `${m} mois plus tard`
  const y = Math.floor(m / 12), r = m % 12
  if (r === 0) return y === 1 ? 'un an plus tard' : `${y} ans plus tard`
  return `${y === 1 ? 'un an' : y + ' ans'} et ${r} mois plus tard`
}

/** La citation, avec le mot d'ancre rendu visible. Pas un commentaire :
 *  ce qui est commun aux cartes, rendu lisible. */
function quoteHtml(r) {
  if (!r.match) return `«&#8239;${esc(r.quote)}&#8239;»`
  const { start, end } = r.match
  return `«&#8239;${esc(r.quote.slice(0, start))}<em class="anchor">${esc(r.quote.slice(start, end))}</em>${esc(r.quote.slice(end))}&#8239;»`
}

function cardHtml(r, tilt) {
  const head = r.dated
    ? `<div class="date">${esc(monthYear(r.occurredAt))}</div>`
    : `<div class="undated">date inconnue</div>`
  return `<article class="card"${tilt ? ` style="transform:rotate(${tilt}deg)"` : ''}>
      ${head}
      ${r.dreamTitle ? `<div class="dream">${esc(r.dreamTitle)}</div>` : ''}
      <p class="quote">${quoteHtml(r)}</p>
    </article>`
}

function threadHtml(th) {
  const isLine = th.grammar === 'ligne'
  const fact = isLine && th.span
    ? `${th.readings.length} lectures, entre ${monthYear(th.span.from)} et ${monthYear(th.span.to)}.`
    : 'Ces lectures ne peuvent pas être mises dans l’ordre — toutes n’ont pas de date.'
  let factWhen = ''
  if (!isLine) {
    const days = [...new Set(th.readings.filter((r) => !r.dated && r.depositedAt).map((r) => r.depositedAt.slice(0, 10)))].sort()
    if (days.length === 1) factWhen = `Leurs rêves ont été déposés le ${fullDate(days[0])} ; la date du rêve, elle, n’a jamais été posée.`
    else if (days.length > 1) {
      const sameMonth = days.every((d) => d.slice(0, 7) === days[0].slice(0, 7))
      const when = sameMonth
        ? `les ${days.map((d) => Number(d.slice(8, 10))).join(' et ')} ${monthYear(days[0])}`
        : `entre le ${fullDate(days[0])} et le ${fullDate(days[days.length - 1])}`
      factWhen = `Leurs rêves ont été déposés ${when} ; la date du rêve, elle, n’a jamais été posée.`
    }
  }

  const cards = th.readings.map((r, i) => {
    const prev = i > 0 ? th.readings[i - 1] : null
    const tilt = isLine ? 0 : (i % 2 === 0 ? -0.382 : 0.382)
    return `<div class="slot${i === 0 ? ' first' : ''}">
      ${isLine && prev ? `<div class="gap">${esc(gapLabel(prev.occurredAt, r.occurredAt))}</div>` : ''}
      ${isLine ? '<span class="dot" aria-hidden="true"></span>' : ''}
      ${cardHtml(r, tilt)}
    </div>`
  }).join('\n')

  return `<section class="thread ${isLine ? 'line' : 'scatter'}">
    <h2 class="anchor-word">${esc(th.anchor)}</h2>
    <div class="fact">${esc(fact)}</div>
    ${factWhen ? `<div class="factwhen">${esc(factWhen)}</div>` : ''}
    <div class="stack">
      ${isLine ? '<span class="rail" aria-hidden="true"></span>' : ''}
      <div class="cards">
        ${cards}
        <div class="slot">
          ${isLine ? '<span class="dot hollow" aria-hidden="true"></span>' : ''}
          <div class="card today">
            <div class="date dimmed">aujourd’hui</div>
            <div class="field">si tu veux en dire quelque chose maintenant.</div>
          </div>
        </div>
      </div>
    </div>
    ${th.undatedHeld === 1 ? '<div class="held">1 autre lecture porte ce mot. Elle n’a pas de date, elle ne peut pas entrer dans cette ligne.</div>' : th.undatedHeld > 1 ? `<div class="held">${th.undatedHeld} autres lectures portent ce mot. Elles n’ont pas de date, elles ne peuvent pas entrer dans cette ligne.</div>` : ''}
    <div class="appline">Ce sont tes phrases. Je ne les commente pas.</div>
  </section>`
}

function frame(inner, label, note) {
  return `<div class="frame-wrap">
    <div class="frame-label">${label}${note ? `<span class="frame-note">${note}</span>` : ''}</div>
    <div class="frame">${inner}</div>
  </div>`
}

const A = data.threads.find((t) => t.anchorSlug === 'rêve')
const B = data.threads.find((t) => t.anchorSlug === 'je me demande')
const C = data.threads.find((t) => t.anchorSlug === 'confiance')
const D = data.alternates.find((t) => t.anchorSlug === 'puissance')
const E = data.alternates.find((t) => t.anchorSlug === 'intégrité')

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Miroir — « ce que j’en ai dit »</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Hanken+Grotesk:wght@400;600&display=swap" rel="stylesheet">
<style>
  /* ── TOKENS — copie fidèle de src/lib/dream-design.ts (nuit bleue, D1) ── */
  :root{
    --bg:linear-gradient(168deg,#2b2534 0%,#221d29 55%,#191521 100%);
    --bgTop:#2b2534; --gold:#e0c087; --onGold:#241f18;
    --cream:#f1e8d7; --ink:#ddd4de; --dim:#b9b0bd; --faint:#a49aad;
    --card:rgba(255,255,255,.045); --cardBorder:rgba(255,255,255,.08);
    --line:rgba(255,255,255,.08); --moon:#e9dcbc;
    --serif:"Newsreader","EB Garamond",Georgia,serif;
    --display:"Cormorant Garamond","EB Garamond",Georgia,serif;
    --sans:"Hanken Grotesk","Inter",system-ui,sans-serif;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);background-attachment:fixed;min-height:100vh;
       font-family:var(--sans);color:var(--ink);
       -webkit-font-smoothing:antialiased;padding:0 0 144px}
  /* grain — 2%, immobile (les écrans de lecture ne bougent pas) */
  body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.02;
    mix-blend-mode:overlay;background-repeat:repeat;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='144' height='144'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

  /* ── l'en-tête de l'aperçu (pas l'app : le cadre de présentation) ── */
  header{max-width:987px;margin:0 auto;padding:89px 34px 0;position:relative;z-index:2}
  h1{font-family:var(--serif);font-style:italic;font-weight:400;font-size:45px;
     color:var(--cream);line-height:1.272;margin:0}
  .sub{margin-top:21px;font-size:17px;line-height:1.618;color:var(--dim);max-width:610px}
  .facts{margin-top:34px;display:grid;grid-template-columns:repeat(4,1fr);gap:21px;
         padding-top:21px;border-top:1px solid var(--line);max-width:754px}
  @media (max-width:700px){.facts{grid-template-columns:repeat(2,1fr)}}
  .facts div{font-size:13px;color:var(--faint);line-height:1.618}
  .facts b{display:block;font-family:var(--display);font-size:28px;color:var(--cream);font-weight:400}

  /* ── la galerie de cadres ── */
  .gallery{max-width:987px;margin:0 auto;padding:0 34px;position:relative;z-index:2}
  .frame-wrap{margin-top:144px}
  .frame-label{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;
               color:var(--faint);margin-bottom:21px}
  .frame-note{display:block;text-transform:none;letter-spacing:.02em;font-weight:400;
              font-size:13px;color:var(--faint);margin-top:8px;max-width:610px;line-height:1.618}
  .frame{width:390px;max-width:100%;border:1px solid var(--cardBorder);border-radius:21px;
         padding:34px 21px 55px;background:rgba(255,255,255,.012)}

  /* ── LE MONTAGE ── */
  .thread{}
  .anchor-word{margin:0;font-family:var(--display);font-style:italic;font-weight:400;
               font-size:40px;color:var(--cream);line-height:1.272}
  .factwhen{margin-top:5px;font-size:13px;color:var(--faint);line-height:1.618}
  .fact{margin-top:8px;font-size:14px;color:var(--faint);line-height:1.618}
  .stack{margin-top:34px;position:relative}
  .rail{position:absolute;left:3px;top:13px;bottom:13px;width:1px;
        background:linear-gradient(180deg,transparent,rgba(255,255,255,.13) 8%,rgba(255,255,255,.13) 92%,transparent)}
  .line .cards{padding-left:34px}
  .slot{position:relative;margin-top:34px}
  .slot.first{margin-top:0}
  .gap{position:absolute;left:-21px;top:-26px;width:233px;font-size:13px;color:var(--faint);letter-spacing:.04em}
  .dot{position:absolute;left:-34px;top:26px;margin-left:-1px;width:8px;height:8px;
       border-radius:50%;background:var(--moon);opacity:.61}
  .dot.hollow{background:transparent;border:1px solid var(--moon)}

  .card{background:var(--card);border:1px solid var(--cardBorder);border-radius:13px;padding:21px}
  .date{font-family:var(--display);font-size:28px;font-weight:400;color:var(--cream);line-height:1.272;letter-spacing:.01em}
  .date.dimmed{color:var(--dim)}
  .undated{font-family:var(--display);font-style:italic;font-size:22px;color:var(--faint);line-height:1.272}
  .why{margin-top:5px;font-size:13px;color:var(--faint);line-height:1.618}
  .dream{margin-top:8px;font-size:13px;color:var(--faint);letter-spacing:.02em}
  .quote{margin:13px 0 0;font-family:var(--serif);font-size:19px;line-height:1.618;color:var(--ink)}
  .anchor{font-style:normal;color:var(--cream);border-bottom:1px solid rgba(224,192,135,.4);padding-bottom:1px}

  .card.today{background:transparent;border:1px dashed rgba(255,255,255,.11)}
  .field{margin-top:13px;min-height:89px;font-family:var(--serif);font-size:19px;
         line-height:1.618;color:var(--faint);opacity:.61}

  .held{margin-top:21px;font-size:13px;color:var(--faint);line-height:1.618}
  .line .held,.line .appline{padding-left:34px}
  .appline{margin-top:34px;font-family:var(--serif);font-style:italic;font-size:17px;
           color:var(--faint);line-height:1.618}

  /* ── le refus ── */
  .refusal h2{margin:0;font-family:var(--serif);font-style:italic;font-weight:400;
              font-size:34px;color:var(--cream);line-height:1.272}
  .refusal .l1{margin-top:89px;font-family:var(--serif);font-style:italic;font-size:21px;
               color:var(--dim);line-height:1.618}
  .refusal .l2{margin-top:21px;font-size:17px;color:var(--faint);line-height:1.618}

  /* ── l'invitation, dans le journal ── */
  .invite{border-top:1px solid var(--line);padding:21px 3px;margin-top:34px}
  .invite .a{font-family:var(--serif);font-style:italic;font-size:17px;color:var(--dim);line-height:1.618}
  .invite .b{margin-top:4px;font-size:13px;color:var(--faint)}
  .ghost{font-family:var(--serif);font-size:17px;color:var(--faint);line-height:1.618;opacity:.61}

  footer{max-width:987px;margin:144px auto 0;padding:34px;position:relative;z-index:2;
         border-top:1px solid var(--line);font-size:13px;color:var(--faint);line-height:1.618}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>

<header>
  <h1>« ce que j’en ai dit »</h1>
  <p class="sub">
    Le mode le plus honnête du miroir : l’app ne dit rien d’elle-même. Elle pose tes lectures
    côte à côte, elle les date, et elle se tait. <strong style="color:var(--ink);font-weight:400">
    Toutes les phrases entre guillemets ci-dessous sont les tiennes</strong>, sorties de la base
    par le moteur, sans retouche. Rien n’a été écrit à la main pour cet aperçu.
  </p>
  <div class="facts">
    <div><b>${data.readingsTotal}</b>passages « lecture »<br>posés par B4</div>
    <div><b>${data.dreamsAfterDedup}</b>rêves après<br>dédoublonnage (${data.dreamsTotal} en base)</div>
    <div><b>${data.undatedDreams}</b>sans date fiable<br>— d’où le pêle-mêle</div>
    <div><b>${data.threads.length}</b>fils tenus<br>par le moteur ce soir</div>
  </div>
</header>

<div class="gallery">

${frame(threadHtml(A), 'Montage 1 — la ligne', 'Le fil le plus profond du corpus : le mot « rêve » dans tes propres lectures. Quatre cartes choisies mécaniquement (la plus ancienne, la plus récente, et les deux qui écartent le plus la ligne), jamais « les meilleures ». La date est en grand ; l’écart entre deux cartes est écrit en toutes lettres. C’est le temps qui fait le travail.')}

${frame(threadHtml(B), 'Montage 2 — la ligne courte', 'Trois cartes, vingt-deux mois. La doctrine dit que deux qui se répondent valent mieux que huit qui s’accumulent : c’est ce format-là. La dernière est de ce matin.')}

${frame(threadHtml(C), 'Montage 3 — le pêle-mêle', 'Dès qu’une seule lecture n’a pas de date fiable, le filet disparaît, les cartes se posent à plat, et l’écran dit pourquoi. Trente-neuf de tes soixante rêves sont dans ce cas. Un montage temporel qui ment serait pire que pas de montage.')}

${D ? frame(threadHtml(D), 'Montage 4 — deux fois le contraire', 'Le moteur ne sait pas qu’il y a une contradiction là-dedans, et il n’a pas le droit de la nommer. Il pose le mot et les cartes. Lis la troisième et la quatrième l’une après l’autre. <em>Ce fil existe, mais l’écran ne l’a pas retenu ce soir : ses rêves étaient déjà pris par un fil précédent.</em>') : ''}

${E ? frame(threadHtml(E), 'Montage 5 — le couple', 'Le format minimal : deux lectures, deux rêves. Rien d’autre. <em>Fil réel, non retenu ce soir par la règle de dispersion.</em>') : ''}

${frame(`<section class="refusal">
    <h2>ce que j’en ai dit</h2>
    <div class="l1">Rien à poser côte à côte.</div>
    <div class="l2">Aucun mot n’est encore revenu dans deux de tes lectures. Reviens quand une phrase en aura rejoint une autre.</div>
  </section>`, 'Le refus', 'L’écran sur lequel tu jugeras le plus dur, parce que l’app ne donne rien et doit quand même valoir la peine d’être ouverte. Il est motivé, il ne s’excuse pas, il ne promet rien pour demain. Le silence est une sortie normale, pas une panne.')}

${frame(`<div class="ghost">…</div>
  <div class="invite">
    <div class="a">ce que j’en ai dit</div>
    <div class="b">tes lectures, côte à côte</div>
  </div>`, 'L’entrée', 'Pas un onglet — une mention basse et grise en bas du journal des grands rêves, après les rêves. Une invitation, jamais une entrée : l’app laisse une trace, elle ne délivre pas.')}

</div>

<footer>
  Aperçu généré le ${esc(new Date(data.generatedAt).toLocaleString('fr-FR'))} par
  <code>scripts/mirror-said-render.mjs</code>, depuis le moteur réel
  (<code>src/lib/mirror/what-i-said.ts</code>) et le corpus réel.
  Tokens : <code>src/lib/dream-design.ts</code>. Loi : <code>DOCTRINE-MIROIR.md</code>.
  Zéro phrase générée par un modèle sur cet écran — et il ne doit jamais y en avoir.
</footer>

</body>
</html>`

const out = path.join(ROOT, 'APERCU-MIROIR-CE-QUE-JEN-AI-DIT.html')
fs.writeFileSync(out, html)
console.log('écrit :', out, `(${(html.length / 1024).toFixed(1)} Ko)`)
