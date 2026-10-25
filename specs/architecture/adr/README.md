# Architecture Decision Records

Formato [MADR](https://adr.github.io/madr/) semplificato. File: `NNNN-titolo-in-kebab-case.md`.

## Stati

- `Proposed`: proposta, **non** approvata. Non va trattata come vincolo definitivo.
- `Accepted`: approvata dal product owner o imposta dal mandato.
- `Deprecated` / `Superseded by NNNN`: non più valida.

Un ADR `Accepted` non si modifica nella sostanza: si crea un nuovo ADR che lo sostituisce.

## Indice

| ADR | Titolo | Stato | Data |
| --- | --- | --- | --- |
| [0001](0001-registrare-le-decisioni-architetturali.md) | Registrare le decisioni architetturali | Accepted | 2026-10-25 |
| [0002](0002-stack-tecnologico-di-base.md) | Stack tecnologico di base | Accepted (mandato); versioni Proposed | 2026-10-25 |
| [0003](0003-isolamento-multi-tenant.md) | Isolamento multi-tenant con `organization_id` e RLS | Proposed | 2026-10-25 |
| [0004](0004-lock-di-modifica-esclusivo.md) | Lock di modifica esclusivo per edizione | Proposed | 2026-10-25 |
| [0005](0005-contenuto-strutturato-e-validato.md) | Contenuto strutturato e validato | Proposed | 2026-10-25 |
| [0006](0006-snapshot-di-pubblicazione-e-rendering.md) | Snapshot di pubblicazione e rendering | Proposed | 2026-10-25 |
| [0007](0007-provider-adapter.md) | Provider adapter per email, AI e fonti esterne | Proposed | 2026-10-25 |
| [0008](0008-strategia-di-test.md) | Strategia e strumenti di test | Proposed | 2026-10-25 |
| [0009](0009-lingua-documentazione-e-codice.md) | Lingua di documentazione e codice | Proposed | 2026-10-25 |

Nuovo ADR: copiare [template.md](template.md).
