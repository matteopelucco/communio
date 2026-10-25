# Architettura — panoramica

- **Stato:** In Review
- **Ultimo aggiornamento:** 2026-10-25
- **Decisioni collegate:** [ADR index](adr/README.md)

## Contesto

```text
             ┌──────────────────────────── Vercel (Preview / Production) ───────────────────────────┐
 Browser ───▶│ Next.js App Router                                                                    │
 (redattore) │  ├─ Server Components / Server Actions / Route Handlers  ── validazione + authz ──┐   │
             │  ├─ Client Components (editor, stato salvataggio, heartbeat lock)                  │   │
 Browser ───▶│  ├─ Rotte pubbliche /{org}/edizioni/...  (solo publications pubblicate)            │   │
 (anonimo)   │  └─ Rendering: HTML (React) · PDF (Chromium, da validare: spike #14)               │   │
             └────────────────────────────────────────────────────────────────────────────────────┼───┘
                                                                                                  ▼
             ┌─────────────────────────────── Supabase ──────────────────────────────────────────────┐
             │ Auth (sessione via cookie, @supabase/ssr) · PostgreSQL + RLS + RPC · Realtime · Storage │
             └────────────────────────────────────────────────────────────────────────────────────────┘
                     Adapter: EmailProvider (local | resend) · AiProvider (none | mock | …post-MVP)
```

In locale lo stesso schema gira con `next dev` e Supabase CLI su Docker; nessun servizio hosted.

## Moduli applicativi (proposta)

Struttura per dominio, senza microservizi né framework interni ([mandato §3.9](../../docs/communio-master-prompt.md)):

```text
src/
  app/                      # rotte Next.js (UI, server actions, route handlers)
    (auth)/  (app)/  (public)/
  domains/
    tenancy/                # organizzazioni, parrocchie, luoghi, membership
    editions/               # edizioni, sezioni, schemi di contenuto, ciclo di vita
    locking/                # lock e autosalvataggio (client + server)
    publishing/             # snapshot, rendering, archivio
    songs/                  # catalogo, repertori, selezioni
    audit/
  lib/
    supabase/               # client server/browser, tipi generati
    email/                  # EmailProvider + adapter
    validation/  errors/  logging/
supabase/
  config.toml  migrations/  seed.sql  tests/   # pgTAP
tests/
  unit/  integration/
e2e/                        # Playwright
scripts/                    # wrapper test, utilità di sviluppo
```

La struttura definitiva è fissata dall'issue #2 e documentata qui.

## Confini e responsabilità

| Livello | Responsabilità | Non deve |
| --- | --- | --- |
| PostgreSQL (RLS, vincoli, RPC) | Isolamento tenant, integrità referenziale, lock atomico, versioni. Ultima linea di difesa. | Dipendere dal client per correttezza. |
| Server Next.js | Autenticazione della richiesta, validazione input (schema), regole di dominio, orchestrazione, rendering, adapter esterni. | Usare `service_role` per operazioni utente ordinarie. |
| Client | UX: stato di salvataggio, heartbeat, sola lettura, anteprima. | Essere l'unico controllo di permessi, lock o validazione. |

La ripartizione puntuale dei controlli del lock è in [security-model.md](security-model.md#ripartizione-dei-controlli).

## Flussi principali

1. **Modifica di un'edizione:** apertura → acquisizione lock (RPC) → heartbeat ogni 30 s → autosalvataggio
   per sezione con `expected_version` → conflitto/expiry ⇒ editor in sola lettura e messaggio chiaro.
2. **Pubblicazione:** verifica permesso → validazione completa → creazione snapshot immutabile
   (contenuto + `template_version`) → generazione HTML/PDF dallo snapshot → stato `published` solo a
   generazione confermata → audit.
3. **Consultazione pubblica:** query esclusivamente su `publications` pubblicate (vista/policy dedicata
   ad `anon`), mai su bozze.
4. **Invito utente:** admin crea invito → token monouso con hash salvato → email via `EmailProvider`
   → accettazione autenticata → membership.

## Decisioni chiave

| ADR | Titolo | Stato |
| --- | --- | --- |
| [0001](adr/0001-registrare-le-decisioni-architetturali.md) | Registrare le decisioni architetturali | Accepted |
| [0002](adr/0002-stack-tecnologico-di-base.md) | Stack tecnologico di base | Accepted (vincolo del mandato); versioni Proposed |
| [0003](adr/0003-isolamento-multi-tenant.md) | Isolamento multi-tenant con `organization_id` e RLS | Proposed |
| [0004](adr/0004-lock-di-modifica-esclusivo.md) | Lock di modifica esclusivo per edizione | Proposed |
| [0005](adr/0005-contenuto-strutturato-e-validato.md) | Contenuto strutturato e validato | Proposed |
| [0006](adr/0006-snapshot-di-pubblicazione-e-rendering.md) | Snapshot di pubblicazione e rendering | Proposed |
| [0007](adr/0007-provider-adapter.md) | Provider adapter per email, AI e fonti | Proposed |
| [0008](adr/0008-strategia-di-test.md) | Strategia e strumenti di test | Proposed |
| [0009](adr/0009-lingua-documentazione-e-codice.md) | Lingua di documentazione e codice | Proposed |

## Rischi tecnici noti

| Rischio | Mitigazione |
| --- | --- |
| PDF con Chromium su Vercel (dimensione, memoria, timeout). | Spike #14 prima di F-010; alternativa worker separato come scelta esplicita. |
| Compatibilità TypeScript 7 (compilatore nativo) con Next.js 16. | Verifica in #2; ripiego sull'ultima 5.x/6.x supportata. |
| RLS complessa e regressioni silenziose. | pgTAP con casi negativi cross-tenant in CI dal primo schema. |
| Supabase CLI su Windows/Docker. | Comandi via `npx supabase` con versione fissata; istruzioni in [local-development.md](local-development.md). |
