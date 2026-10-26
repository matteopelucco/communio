# CLAUDE.md — Communio

SaaS multi-tenant per bollettini parrocchiali e agende liturgiche. Il contratto operativo completo è
[docs/communio-master-prompt.md](docs/communio-master-prompt.md): in caso di conflitto prevale il
mandato, poi le specifiche approvate in [specs/](specs/README.md), poi questo file.

## Stato attuale

- Fase: **bootstrap approvato e mergiato (PR #18, 2026-10-25)**; scope MVP `Approved`.
- Decisioni del product owner (dettagli in [open-questions.md](specs/product/open-questions.md)):
  - organizzazione = unità pastorale (OQ-01);
  - politica di pubblicazione `restricted`/`open` scelta dal titolare, revisione facoltativa (OQ-02, OQ-13);
  - accesso con email e password, nessuna registrazione libera, form di richiesta di accesso approvata dal gestore del servizio (OQ-03, OQ-14, OQ-15);
  - intenzioni e recapiti pubblicati come nel cartaceo, sotto la responsabilità dell'ente (OQ-04);
  - archivio pubblico, fogli visibili a tutti (OQ-06);
  - testi completi dei canti ammessi, catalogo condiviso curato dal gestore del servizio (OQ-05, OQ-16).
- Non esiste ancora codice applicativo né `package.json`: li introduce l'issue #2. **Implementazione
  ferma per decisione del product owner**: non avviare lo sviluppo senza sua indicazione esplicita.
- Questioni ancora aperte: OQ-07, OQ-08 (non bloccanti), OQ-09, OQ-10 (prima del go-live/deploy).

## Regole non negoziabili

1. **Spec prima del codice.** Nessuna feature senza specifica `Approved` in `specs/features/` e issue `Ready`.
2. **Test prima dell'implementazione** (RED → GREEN → REFACTOR). Il RED deve fallire per il motivo atteso, non per l'ambiente.
3. **Una issue alla volta**, su branch `feat/<n>-slug`, `fix/<n>-slug` o `chore/<n>-slug`. Mai lavorare su `main`.
4. **Mai merge, mai deploy di produzione, mai migrazioni o reset su Supabase remoto** senza approvazione esplicita.
5. **Non inventare requisiti o policy di prodotto.** Decisioni non bloccanti: proponi e documenta (ADR/spec). Bloccanti: domanda breve con opzioni e conseguenze.
6. **Non dichiarare** test eseguiti, issue create o board aggiornata se non è vero e verificato.
7. **Niente segreti** nel repo, nei log o nel bundle client. Mai `service_role` lato client.
8. **Dati sintetici** in seed, fixture e test. Il materiale in `docs/reference-private/` contiene dati personali reali: non copiarlo in file versionati.

## Invarianti architetturali (dettaglio in specs/architecture/)

- Contenuto editoriale strutturato e validato è canonico; HTML/PDF sono rendering dello stesso snapshot.
- Ogni riga tenant-scoped ha `organization_id`, FK coerenti e policy RLS testate (anche cross-tenant negative).
- Autorizzazione, validazione e lock sono verificati su server/DB; il client è solo UX.
- Le pubblicazioni sono snapshot immutabili; modificare una bozza non cambia una pubblicazione.
- Email, AI e fonti esterne stanno dietro adapter; in locale nessuna chiamata esterna (email `local`, AI off).
- Niente HTML utente non sanificato. Import e output AI sono input non attendibili.
- No silent failure: mai mostrare "salvato/pubblicato/inviato" senza conferma del server.

## Comandi

Gli script npm sono definiti dall'issue #2 e seguenti; nomi vincolati dal mandato §12:

| Scopo | Comando |
| --- | --- |
| Dev server | `npm run dev` |
| Qualità statica | `npm run lint`, `npm run typecheck`, `npm run format:check` |
| Supabase locale | `npm run supabase:start`, `npm run supabase:stop`, `npm run db:reset`, `npm run db:types` |
| Test | `npm run test:unit`, `npm run test:integration`, `npm run test:e2e`, `npm run test:e2e:smoke` |
| Tutto (CI) | `npm run verify` |

Disponibili già ora:

- Lint Markdown: `npx --yes markdownlint-cli2@0.24.0`
- Test degli hook Claude: `node --test ".claude/hooks/*.test.mjs"`

Esegui sempre prima la suite più mirata, poi i check della Definition of Done. Per Playwright usa
solo gli script npm (wrapper con output compatto, log completi in `artifacts/`): non leggere report
JSON/HTML integrali nel contesto.

## Agenti (`.claude/agents/`)

Orchestrazione per feature (mandato §5), mai due agenti in scrittura sugli stessi file:

1. `product-analyst` → specifica, criteri Given/When/Then, issue e board.
2. Approvazione del product owner se cambia il comportamento atteso.
3. `architect-engineer` → piano tecnico/ADR.
4. `test-engineer` → test di accettazione, prova del RED.
5. `architect-engineer` → implementazione minima, GREEN, refactoring.
6. `test-engineer` → suite mirata e regressione.
7. `security-reviewer` → review indipendente del diff, report in `docs/security/reviews/`.
8. Sessione principale → review finale, board, PR, report (formato mandato §19).

## Skills (`.claude/skills/`)

- `/work-on-issue <n>`: flusso completo su una issue, dalla verifica DoR alla PR.
- `/review-spec <path>`: revisione indipendente di una specifica prima dell'approvazione.
- `/tdd-cycle <spec-or-issue>`: ciclo RED/GREEN/REFACTOR con prove.
- `/prepare-pr`: verifica DoD e apertura PR con descrizione completa.

## Guardrail deterministici

`.claude/settings.json` registra hook in `.claude/hooks/` che bloccano o chiedono conferma per
merge, push su `main`, force push, reset/push su Supabase remoto, deploy di produzione, modifiche a
segreti e branch protection. Gli agenti con perimetro di scrittura limitato hanno un hook sui path.
Se un hook blocca un'azione, non aggirarlo: chiedi.

## Mappa della documentazione

- Prodotto: [vision](specs/product/vision.md), [glossario](specs/product/glossary.md), [MVP](specs/product/mvp-scope.md), [bollettino di riferimento](specs/product/reference-bulletin-analysis.md)
- Architettura: [overview](specs/architecture/overview.md), [data model](specs/architecture/data-model.md), [sicurezza](specs/architecture/security-model.md), [sviluppo locale](specs/architecture/local-development.md), [ADR](specs/architecture/adr/README.md)
- Qualità: [TDD e test](specs/quality/tdd-and-test-strategy.md), [criteri di accettazione](specs/quality/acceptance-criteria.md), [tracciabilità](specs/quality/traceability.md)
- Operazioni: [workflow GitHub](specs/operations/github-workflow.md) · Backlog: [roadmap](specs/backlog/roadmap.md)

## Lingua

Documentazione, specifiche, UI e messaggi utente in **italiano**. Codice, identificatori, nomi di
tabelle/colonne e messaggi di commit in **inglese** ([ADR-0009](specs/architecture/adr/0009-lingua-documentazione-e-codice.md)).
