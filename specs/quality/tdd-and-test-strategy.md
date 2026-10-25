# TDD e strategia di test

- **Stato:** In Review
- **Ultimo aggiornamento:** 2026-10-25
- **Decisione:** [ADR-0008](../architecture/adr/0008-strategia-di-test.md)

## Principi

1. I test derivano dai **criteri di accettazione approvati**, non dall'implementazione.
2. Nessuna aspettativa si cambia per far passare un bug: prima si aggiorna la specifica (con motivo), poi il test.
3. I test si eseguono con gli script npm e i risultati riportati sono quelli reali.
4. Risparmiare contesto con output compatti, fixture mirate e agenti isolati, **non** abbassando la qualità.

## Ciclo RED → GREEN → REFACTOR

| Passo | Cosa | Prova da conservare |
| --- | --- | --- |
| 1 | Scrivere i test dai criteri `AC-…` della spec; nome del test con l'ID del criterio. | Diff dei test |
| 2 | Eseguire i test mirati. | Riepilogo: test falliti + **motivo** (asserzione attesa) |
| 3 | Se falliscono per ambiente (DB spento, import mancante, timeout di setup) **non è RED**: correggere l'ambiente. | — |
| 4 | Implementare il minimo per passare. | — |
| 5 | Rieseguire fino a GREEN. | Riepilogo verde |
| 6 | Refactoring; rieseguire la suite mirata e poi quella ampia. | Riepilogo verde |
| 7 | Per i bug: test di regressione che fallisce prima della correzione. | Riepilogo rosso → verde |

La prova del RED si riporta nella PR (sezione "Test-first") come estratto breve: comando, conteggio,
nomi dei test e una riga di motivo per ciascuno.

Un test rosso è ammesso solo nel branch locale durante il ciclo; la PR pronta per la revisione ha CI
verde o un'eccezione esplicitamente approvata.

## Livelli

| Livello | Cosa copre | Strumento | Regole |
| --- | --- | --- | --- |
| Unit | Funzioni pure: validazione schemi, regole di dominio, trasformazioni, formattazione date liturgiche | Vitest | Nessun I/O; veloci |
| Integration | Server actions/servizi contro Supabase locale; provider mock | Vitest | DB locale resettato/seed; dati isolati per test |
| Database | RLS, privilegi, RPC, trigger, vincoli | pgTAP (`supabase test db`) | Positivi **e negativi** cross-tenant per ogni policy |
| E2E | Flussi critici: login, ruoli, due tenant, lock concorrente, pubblicazione, accesso anonimo, accessibilità | Playwright | Solo ambiente locale; niente `sleep`; selettori accessibili (`getByRole`, `getByLabel`) |
| Statici | Lint, typecheck, format, audit dipendenze | ESLint, tsc, Prettier, npm audit | In `verify` e CI |

## Copertura minima attesa per feature

- Ogni criterio `AC-…` è coperto da almeno un test automatico, indicato nella [matrice](traceability.md).
- Ogni policy RLS: test per ruolo autorizzato, ruolo non autorizzato, altro tenant, anonimo.
- Ogni RPC `SECURITY DEFINER`: test negativi (non autenticato, non membro, altro tenant, input invalido).
- Ogni flusso con stato di salvataggio/pubblicazione: test del caso di errore (no silent failure).

La copertura di riga non è un obiettivo in sé; può essere misurata e riportata, non imposta come soglia nell'MVP.

## Dati di test

- Seed sintetico deterministico in `supabase/seed.sql`: almeno **due organizzazioni**, parrocchie e
  luoghi, utenti per ogni ruolo, un'edizione per stato. Nomi chiaramente fittizi.
- Mai dati reali o copiati dal bollettino campione.
- Utenti di test con password note solo in locale/CI, mai riusate altrove.
- Ogni test E2E che modifica dati crea le proprie entità (prefisso univoco per run) o ripristina lo stato.

## Playwright a basso costo di contesto

Requisiti per il wrapper `scripts/test/run-playwright.mjs` (issue #4):

1. Esegue Playwright con reporter `dot` in console + `json` e `html` su file.
2. Salva tutto in `artifacts/test-runs/<YYYYMMDD-HHMMSS>-<shortid>/` (ignorato da Git): `stdout.log`, `report.json`, `html/`, trace/screenshot dei fallimenti.
3. Stampa un riepilogo di **al massimo ~30 righe**:
   - exit code, totali (passati/falliti/saltati/flaky), durata;
   - se fallisce: per ogni test fallito titolo, file:riga e le prime 3–5 righe utili dell'errore (al massimo 10 test, poi "+N altri");
   - percorso della cartella del run.
4. Se tutto passa: nessuno stack trace, nessun elenco dei test.
5. Exit code uguale a quello di Playwright.
6. Funziona su Windows, macOS e Linux (solo Node, niente bash).

Configurazione Playwright: `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, `video: 'off'`,
`retries: process.env.CI ? 1 : 0`, `forbidOnly: !!process.env.CI`, `webServer` che avvia l'app locale.
I test flaky segnalati dal retry generano una issue, non vengono ignorati.

## CI

Job previsti (issue #2–#5): install deterministico (`npm ci`) → lint/typecheck/format → unit → Supabase
locale + `db reset` + pgTAP + integration → build → E2E (smoke su ogni PR, completo su `main` e su
richiesta) → audit dipendenze. Gli artifact dei test si caricano solo in caso di fallimento.
