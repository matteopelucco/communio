---
name: tdd-cycle
description: Esegue il ciclo RED → GREEN → REFACTOR di Communio per una specifica o issue approvata, con prova sintetica del fallimento atteso e verifiche reali. Usare quando si scrivono test e codice per una feature o un bug già specificati.
argument-hint: "<percorso-spec | numero-issue>"
arguments: [target]
---

# Ciclo TDD per $target

Riferimento: `specs/quality/tdd-and-test-strategy.md`. I test derivano dai criteri `AC-…` della
specifica **approvata**; nessuna aspettativa si cambia per far passare un bug.

## Prerequisiti (verifica, non presumere)

- Spec in stato `Approved` e issue `Ready`; branch dedicato (non `main`).
- Ambiente pronto: Docker avviato se servono DB/E2E (`npm run supabase:start`), dipendenze installate.

## 1. Mappa criteri → test

Tabella: `AC-…` → livello (unit / integration / pgTAP / E2E) → file di test previsto. Includi i criteri
trasversali `AC-X-xx` pertinenti (cross-tenant, anonimo, validazione server, no silent failure, a11y).

## 2. RED — agente `test-engineer`

1. Scrive i test con l'ID del criterio nel nome.
2. Esegue **solo** i test mirati via script npm, ad esempio:
   - `npm run test:unit -- <file-o-pattern>`
   - `npm run test:integration -- <file-o-pattern>`
   - `npm run test:e2e -- <file> --grep "AC-007"`
3. Classifica ogni fallimento:
   - **RED valido:** asserzione sul comportamento atteso non ancora implementato;
   - **non valido:** errore di ambiente, import, sintassi, setup → correggere e rieseguire. Non chiamarlo RED.
4. Prova sintetica da conservare per la PR:

   ```text
   RED — <comando>
   <n> falliti / <m> totali
   - AC-007-03 rejects save after lock expiry — expected status 409, received 200
   ```

## 3. GREEN — agente `architect-engineer`

Implementazione minima. Riesecuzione dei test mirati fino al verde. Nessuna modifica ai test da parte dell'implementer.

## 4. REFACTOR

Miglioramenti senza cambiare comportamento; rieseguire i test mirati, poi la suite ampia
(`npm run verify` o i check della DoD).

## 5. Bug e regressioni

Per un bug: prima un test che riproduce il difetto (RED), poi la correzione (GREEN).

## Output

```text
TDD — $target
Criteri coperti: AC-… (n/n)
RED: <comando> → <falliti>/<totali>, motivi validi: sì/no
GREEN: <comando> → <passati>/<totali>
Suite ampia: <comando> → <esito>
Log completi: artifacts/test-runs/<run-id>/ (se E2E)
```
