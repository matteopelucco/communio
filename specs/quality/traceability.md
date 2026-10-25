# Matrice di tracciabilità

- **Ultimo aggiornamento:** 2026-10-25

Fonte canonica del collegamento **requisito → specifica → issue → test → PR**. Si aggiorna nella
stessa PR che cambia uno degli elementi. I criteri di dettaglio (`AC-…`) e i relativi file di test si
elencano nella sezione "Collegamenti" di ciascuna specifica di feature; qui il livello è il requisito.

## Requisiti MVP

| Requisito | Specifica | Issue | Test (file) | PR | Stato |
| --- | --- | --- | --- | --- | --- |
| MVP-01 Autenticazione | F-002 | #7 | — | — | Refinement |
| MVP-02 Tenant, parrocchie, utenti, ruoli | F-001, F-002 | #6, #7 | — | — | Refinement |
| MVP-03 Dashboard e ciclo di vita | F-005 | #10 | — | — | Refinement |
| MVP-04 Editor modulare | F-006 | #11 | — | — | Refinement |
| MVP-05 Lock esclusivo | F-007 | #12 | — | — | Refinement |
| MVP-06 Autosalvataggio e concorrenza | F-007 | #12 | — | — | Refinement |
| MVP-07 Anteprima | F-009 | #15 | — | — | Refinement |
| MVP-08 Template iniziale | F-009 | #15 | — | — | Refinement |
| MVP-09 Pubblicazione HTML/PDF e archivio | F-010 | #16, #14 (spike) | — | — | Refinement |
| MVP-10 Canti e repertori | F-011 | #17 | — | — | Refinement |
| MVP-11 Duplicazione edizione | F-008 | #13 | — | — | Refinement |
| MVP-12 Audit | F-004 | #9 | — | — | Refinement |
| MVP-13 Email applicative | F-003 | #8 | — | — | Refinement |
| MVP-14 Richiesta di accesso, nessuna registrazione libera | F-002 | #7 | — | — | Refinement |

## Requisiti non funzionali e infrastruttura

| Requisito | Dove si verifica | Issue | Stato |
| --- | --- | --- | --- |
| NFR-01 Isolamento tenant | pgTAP + E2E due tenant | #3, #6 | Refinement |
| NFR-03 Local-first | CI senza segreti hosted | #2, #3, #4 | Refinement |
| NFR-05 Accessibilità | axe negli E2E | #4 | Refinement |
| NFR-08 Header/CSP | test header | #5 | Refinement |
| Bootstrap progettuale | — (documentale) | #1, PR #18 | Done (mergiata 2026-10-25) |

## Legenda stati

Allineati alla board: `Inbox`, `Refinement`, `Ready`, `In Progress`, `In Review`, `Blocked`, `Done`.
