# Specifiche di Communio

Questa cartella è la **fonte canonica** dei requisiti. Issue, PR e codice rimandano qui; non
mantenere copie divergenti altrove. Le issue GitHub sono canoniche per lo **stato di avanzamento**,
le specifiche per il **comportamento atteso**.

## Stati dei documenti

| Stato         | Significato                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `Draft`       | In stesura; non utilizzabile per implementare.                           |
| `In Review`   | Completa, in revisione indipendente o in attesa del product owner.       |
| `Approved`    | Approvata dal product owner; base per test e implementazione.            |
| `Implemented` | Comportamento implementato, verificato e mergiato.                       |
| `Deprecated`  | Non più valida; indica il documento che la sostituisce.                  |

Ogni documento riporta in testa stato, data di ultimo aggiornamento e approvazione.

## Indice

### Prodotto

- [vision.md](product/vision.md) — perché esiste Communio, per chi, cosa non è.
- [glossary.md](product/glossary.md) — lessico di dominio (liturgico ed editoriale) e termini tecnici.
- [mvp-scope.md](product/mvp-scope.md) — requisiti MVP numerati (`MVP-xx`), fuori scope, post-MVP.
- [reference-bulletin-analysis.md](product/reference-bulletin-analysis.md) — analisi strutturale del bollettino campione.
- [open-questions.md](product/open-questions.md) — ambiguità e decisioni richieste al product owner.

### Architettura

- [overview.md](architecture/overview.md) — componenti, confini, flussi principali.
- [data-model.md](architecture/data-model.md) — entità, relazioni, vincoli tenant.
- [security-model.md](architecture/security-model.md) — threat model, controlli, ripartizione SQL/server/UX.
- [local-development.md](architecture/local-development.md) — local-first, ambienti, variabili.
- [adr/](architecture/adr/README.md) — Architecture Decision Records.

### Qualità

- [tdd-and-test-strategy.md](quality/tdd-and-test-strategy.md) — livelli, strumenti, RED/GREEN/REFACTOR, Playwright compatto.
- [acceptance-criteria.md](quality/acceptance-criteria.md) — come scrivere i criteri, criteri trasversali.
- [traceability.md](quality/traceability.md) — matrice requisito → spec → issue → test → PR.

### Operazioni e backlog

- [github-workflow.md](operations/github-workflow.md) — branch, issue, PR, labels, board, CI.
- [roadmap.md](backlog/roadmap.md) — milestone e task.

### Feature

- [features/](features/) — una specifica per feature: `F-NNN-<slug>.md`, dal [template](features/_template.md).
