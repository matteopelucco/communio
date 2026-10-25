# 0009 — Lingua di documentazione e codice

- **Stato:** Proposed
- **Data:** 2026-10-25

## Contesto

Il mandato è in italiano e la UI iniziale è in italiano. Il codice e gli strumenti sono in inglese.

## Decisione proposta

| Elemento | Lingua |
| --- | --- |
| Specifiche, ADR, documentazione, issue, descrizioni PR | Italiano |
| UI, messaggi utente, email | Italiano (stringhe centralizzate per una futura localizzazione) |
| Codice, identificatori, tabelle/colonne, nomi di test, log tecnici | Inglese |
| Messaggi di commit | Inglese, stile Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`) |
| Nomi di branch | Inglese o italiano senza accenti, `tipo/<issue>-slug` |

Il [glossario](../../product/glossary.md) fornisce la corrispondenza tra termini italiani e inglesi.

## Conseguenze

- Coerenza con l'ecosistema tecnico; documentazione accessibile al product owner.
- Necessità di mantenere il glossario aggiornato.
