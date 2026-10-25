# 0008 — Strategia e strumenti di test

- **Stato:** Proposed
- **Data:** 2026-10-25
- **Dettaglio:** [tdd-and-test-strategy.md](../../quality/tdd-and-test-strategy.md)

## Decisione proposta

| Livello | Strumento | Dove |
| --- | --- | --- |
| Unit | Vitest | `tests/unit/` (o co-locati `*.test.ts`, da fissare in #2) |
| Integration applicativa | Vitest contro Supabase locale | `tests/integration/` |
| Database (RLS, RPC, privilegi) | pgTAP via `supabase test db` | `supabase/tests/` |
| E2E | Playwright (Chromium), wrapper con output compatto | `e2e/`, `scripts/test/run-playwright.mjs` |
| Accessibilità automatica | `@axe-core/playwright` negli E2E (dipendenza da approvare in #4) | `e2e/` |
| Statici | ESLint, `tsc`, Prettier, `npm audit` | CI |

- Playwright: reporter `dot`/`list` in locale, JSON + HTML salvati in `artifacts/test-runs/<run-id>/`;
  trace `retain-on-failure`, screenshot `only-on-failure`, video `off`; retry 0 in locale, max 1 in CI
  con segnalazione esplicita dei flaky.
- Dati: seed sintetico deterministico + fixture per test; ogni test crea i propri dati o usa dati del
  seed in sola lettura.

## Conseguenze

- pgTAP aggiunge un linguaggio di test (SQL) ma è lo strumento più diretto per verificare RLS e privilegi.
- Il wrapper Playwright è codice da mantenere, giustificato dal requisito di output compatto (mandato §12).
