# 0002 — Stack tecnologico di base

- **Stato:** Accepted per le tecnologie (vincolo del mandato §2); **Proposed** per le versioni puntuali
- **Data:** 2026-10-25
- **Issue:** #2 (setup), #3 (Supabase), #4 (Playwright)

## Contesto

Il mandato fissa lo stack. Restano da scegliere le versioni, verificando la compatibilità reale
invece di presumerla.

## Decisione

| Componente | Scelta | Versione rilevata al 2026-10-25 (`npm view`) | Note |
| --- | --- | --- | --- |
| Runtime | Node.js LTS | 24.x (Active LTS; 24.15.0 installato) | `.nvmrc` = `24`; `engines.node` = `>=24 <25` |
| Package manager | npm | 11.x | Solo npm; `package-lock.json` committato |
| Framework | Next.js App Router + React | `next` 16.4.3 | `engines` di Next: `>=20.9.0` |
| Linguaggio | TypeScript strict | 7.0.2 disponibile | **Da verificare** con Next 16 (compilatore nativo). Se incompatibile: ultima 5.x/6.x supportata, documentata qui |
| CSS | Tailwind CSS v4 + `@tailwindcss/postcss` | 4.3.3 | Configurazione secondo la documentazione ufficiale corrente |
| Backend | Supabase (Postgres, Auth, RLS, Realtime, Storage) | `@supabase/supabase-js` 2.118.0, `@supabase/ssr` 0.12.7 | |
| Supabase CLI | devDependency `supabase` via `npx` | 2.122.0 | Globale installata: 2.120.0 (non usata dagli script) |
| Test unit/integration | Vitest | 5.0.5 | |
| Test E2E | Playwright | 1.64.1 | Solo Chromium di default |
| Hosting | Vercel | — | Lo sviluppo locale non richiede Vercel CLI |
| Email hosted | Resend dietro `EmailProvider` | — | [ADR-0007](0007-provider-adapter.md) |

Regole: solo release stabili (niente canary/beta senza motivazione e approvazione); aggiornamenti major
solo tramite issue dedicata con test.

## Conseguenze

- Le versioni effettive sono quelle registrate nel lockfile dall'issue #2; questa tabella va aggiornata
  nella stessa PR.
- Rischio TypeScript 7 / Next 16: verificato in #2 con `typecheck` e `build`.

## Validazione

`npm ci && npm run verify` verde in CI su runner pulito.
