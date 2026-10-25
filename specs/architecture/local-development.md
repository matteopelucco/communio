# Sviluppo locale e ambienti

- **Stato:** In Review — i comandi diventano operativi con le issue #2, #3, #4
- **Ultimo aggiornamento:** 2026-10-25

## Requisito local-first (verificabile)

Un clone pulito, dopo il setup, deve funzionare **senza** database, email, AI o deploy hosted:

| Servizio | Locale | Preview / Production |
| --- | --- | --- |
| App | `npm run dev` (Next.js) | Vercel |
| Database, Auth, Storage, Realtime | Supabase CLI su Docker | Supabase hosted (progetti separati per ambiente) |
| Email applicative | `EMAIL_PROVIDER=local` (outbox su file/log, nessun invio) | `EMAIL_PROVIDER=resend` |
| Email di Supabase Auth | Mail catcher incluso nello stack Supabase locale | SMTP configurato in Supabase hosted |
| AI | disabilitata (`AI_PROVIDER=none`) o `mock` deterministico | post-MVP |
| Dati | seed sintetico versionato | dati reali, mai copiati in locale |

Eccezioni ammesse: connessione Internet per installare pacchetti npm, immagini Docker e browser
Playwright durante il setup. La Supabase locale **non** deve essere esposta alla rete pubblica.

## Prerequisiti

| Strumento | Versione | Note |
| --- | --- | --- |
| Node.js | 24 LTS (fissata in `.nvmrc` e `engines` dall'issue #2) | Verificato disponibile: 24.15.0 |
| npm | quella fornita con Node 24 | Unico package manager; `package-lock.json` committato |
| Docker Desktop o runtime compatibile | recente | **Deve essere in esecuzione** per Supabase locale |
| Supabase CLI | fissata come devDependency `supabase` ed eseguita via `npx supabase` | Evita divergenze con installazioni globali |
| Git, GitHub CLI | recenti | `gh auth login` per il workflow |

## Setup (operativo dopo #2–#4)

```bash
nvm use                      # oppure installare Node 24 LTS
npm ci
cp .env.example .env.local   # valori locali, nessun segreto reale
npm run supabase:start       # avvia lo stack locale (Docker)
npm run db:reset             # migrazioni + seed sintetico
npm run db:types             # rigenera i tipi TypeScript dal DB locale
npm run dev
npx playwright install --with-deps chromium   # solo la prima volta
npm run verify
```

## Script npm (contratto, mandato §12)

| Script | Comportamento atteso | Issue |
| --- | --- | --- |
| `dev`, `build`, `start` | Next.js | #2 |
| `lint`, `typecheck`, `format:check` | ESLint, `tsc --noEmit`, Prettier `--check` | #2 |
| `supabase:start`, `supabase:stop` | `supabase start` / `supabase stop` | #3 |
| `db:reset` | `supabase db reset` **solo locale** (mai `--linked`) | #3 |
| `db:types` | `supabase gen types typescript --local > src/lib/supabase/database.types.ts` | #3 |
| `test:unit` | Vitest, progetto unit | #2 |
| `test:integration` | Vitest su Supabase locale + `supabase test db` (pgTAP) | #3 |
| `test:e2e` | wrapper Playwright, output compatto | #4 |
| `test:e2e:smoke` | sottoinsieme `@smoke` | #4 |
| `test:e2e:ci` | configurazione CI (reporter compatti + artifact) | #4 |
| `test:all` | unit + integration + e2e | #4 |
| `verify` | lint → typecheck → format:check → unit → integration → e2e → build | #4 |

## Variabili d'ambiente

`.env.example` (introdotto in #2) contiene **solo nomi e placeholder**. Previste:

| Variabile | Ambito | Note |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client+server | URL locale `http://127.0.0.1:54321` in sviluppo |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client+server | Chiave pubblica (protetta da RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **solo server**, uso eccezionale | Mai nel client; ogni uso giustificato in spec |
| `APP_BASE_URL` | server | Link nelle email |
| `EMAIL_PROVIDER` | server | `local` (default) \| `resend` |
| `EMAIL_FROM` | server | Mittente |
| `RESEND_API_KEY` | server, solo hosted | Assente in locale e CI |
| `EMAIL_ALLOWED_RECIPIENT_DOMAINS` | server, local/test | Allowlist destinatari fuori produzione |
| `AI_PROVIDER` | server | `none` (default) |

## Ambienti

| Ambiente | Deploy | Database | Chi può modificarlo |
| --- | --- | --- | --- |
| Local | `next dev` | Supabase locale | Sviluppatore |
| CI | GitHub Actions | Supabase locale nel runner | Workflow |
| Preview | Vercel per PR/branch | Supabase hosted *preview* (da definire, [OQ-10](../product/open-questions.md#oq-10)) | Solo con approvazione |
| Production | Vercel dal branch `main` dopo merge approvato | Supabase hosted *production* | Solo con approvazione esplicita |

Regole: niente comandi `supabase` con `--linked`/`db push` senza approvazione e indicazione del
target; mai `db reset` remoto; nessuna modifica manuale al database remoto senza migrazione.

## Note per Windows

- Usare i fine riga LF (garantiti da `.gitattributes`).
- Docker Desktop deve essere avviato prima di `npm run supabase:start` (al bootstrap risultava spento).
- Gli script npm devono essere cross-platform (niente sintassi bash negli script; usare Node).
