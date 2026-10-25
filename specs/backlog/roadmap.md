# Roadmap MVP

- **Stato:** In Review — proposta da approvare con le specifiche MVP
- **Ultimo aggiornamento:** 2026-10-25

Lo stato aggiornato delle issue è sulla board GitHub (Project "Communio"); questo documento descrive
sequenza, dipendenze e contenuto atteso. Le issue di tipo `spec` producono una specifica `Approved`;
le issue di implementazione derivate si creano dopo l'approvazione, scomposte in PR piccole.

## Sequenza

```text
M0 #1 ─▶ M1 #2 ─▶ #3 ─▶ #4 ─▶ #5
               │
               └─▶ M2 specs #6 #7 #8 #9 (in parallelo alla M1, solo documentali)
                        └─▶ M3 specs #10 #11 #12 #13 ─▶ M4 #14 (spike, presto) #15 #16 ─▶ M5 #17 ─▶ M6
```

Le specifiche possono avanzare in parallelo all'infrastruttura (sono attività indipendenti); il codice
di una feature parte solo con M1 completata e spec `Approved`.

## M0 — Bootstrap progettuale

| Issue | Titolo | Tipo | Esito atteso |
| --- | --- | --- | --- |
| #1 | Bootstrap progettuale: specifiche, agenti, workflow | docs | Questa PR; gate di approvazione |

## M1 — Fondamenta tecniche

| Issue | Titolo | Dipende da | Test attesi | Criteri di accettazione (sintesi) |
| --- | --- | --- | --- | --- |
| #2 | Setup locale riproducibile e CI minima | #1 | Unit di esempio (sanity), build | `npm ci` + `lint`, `typecheck`, `format:check`, `test:unit`, `build` verdi su clone pulito e in CI; Node 24 fissato; TS strict; Tailwind v4; pagina iniziale in italiano senza dati |
| #3 | Supabase locale: config, migrazioni, seed, tipi e harness pgTAP | #2 | pgTAP: RLS abilitata su tutte le tabelle `public`; `db reset` ripetibile | `supabase:start/stop`, `db:reset`, `db:types`, `test:integration` funzionanti; job CI con Supabase locale |
| #4 | Harness Playwright con wrapper a output compatto | #2 (#3 per E2E con DB) | Smoke E2E della home; test del wrapper (riepilogo pass/fail) | Riepilogo ≤ 30 righe; artifact in `artifacts/test-runs/`; trace/screenshot solo su failure; `test:e2e*`, `test:all`, `verify` definiti |
| #5 | Baseline di sicurezza: header, CSP, audit dipendenze, Dependabot | #2 | Test sugli header HTTP | CSP e header presenti; `npm audit --audit-level=high` in CI; `dependabot.yml` senza auto-merge; istruzioni secret scanning |

## M2 — Tenancy, accessi e servizi di base (specifiche)

| Issue | Spec | Contenuto | Decisioni PO necessarie |
| --- | --- | --- | --- |
| #6 | F-001 Tenancy | Organizzazioni, parrocchie, luoghi di culto, slug, timezone, rito, gestione da admin | OQ-01, OQ-08 |
| #7 | F-002 Auth, ruoli e inviti | Login/logout, sessione, ruoli, inviti monouso, gestione membri | OQ-02, OQ-03 |
| #8 | F-003 Email provider | `EmailProvider` local/resend, allowlist, idempotenza | — |
| #9 | F-004 Audit | Eventi essenziali, schema, retention proposta | OQ-09 (parziale) |

## M3 — Edizioni ed editor (specifiche)

| Issue | Spec | Contenuto | Decisioni PO necessarie |
| --- | --- | --- | --- |
| #10 | F-005 Edizioni e dashboard | Creazione, numerazione, intervallo, stati e transizioni, dashboard | OQ-02, OQ-07 |
| #11 | F-006 Editor modulare e sezioni | Tipi di sezione (lettura, canti, agenda, avvisi, articolo, contatti), validazione, riordino, agenda e celebrazioni | OQ-04, OQ-08 |
| #12 | F-007 Lock e autosalvataggio | Lock per sessione, heartbeat, sola lettura, autosave, versioni, realtime | — |
| #13 | F-008 Duplicazione | Copia di un'edizione storica come nuova bozza, ricalcolo date, cosa si copia | — |

## M4 — Rendering e pubblicazione

| Issue | Titolo | Contenuto |
| --- | --- | --- |
| #14 | Spike: PDF con Chromium su Vercel | PoC misurato (dimensione bundle, memoria, tempo, cold start) e raccomandazione A/B/C (ADR-0006). **Consigliato presto** dopo #2 perché può cambiare l'architettura |
| #15 | F-009 Template v1 e anteprima | Template ispirato al campione con miglioramenti di leggibilità; anteprima in editing |
| #16 | F-010 Pubblicazione e archivio | Snapshot immutabile, HTML pubblico, PDF, archivio, ripubblicazione (OQ-04, OQ-06) |

## M5 — Canti e repertori

| Issue | Spec | Contenuto |
| --- | --- | --- |
| #17 | F-011 Catalogo canti e repertori | Catalogo condiviso/locale, diritti, repertori, selezione per momento liturgico (OQ-05) |

## M6 — Hardening e rilascio MVP

Da dettagliare dopo M4: review di sicurezza complessiva e threat model aggiornato, audit di
accessibilità, prestazioni, retention (OQ-09), ambienti hosted (OQ-10), runbook di rilascio.

## Post-MVP (solo con issue e spec approvate)

Import PDF/OCR · fonti liturgiche · AI (suggerimento canti, bozze) · editor template · piani e pagamenti
· notifiche avanzate e approvazioni multilivello · ricerca semantica.
