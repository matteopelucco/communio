---
name: Feature
about: Comportamento nuovo o modificato, collegato a una specifica
title: "F-NNN: <titolo>"
labels: ["type:feature"]
---

## Contesto

Problema utente e motivo. Requisiti: `MVP-xx` / `NFR-xx`.

## Specifica di riferimento

`specs/features/F-NNN-<slug>.md` — stato: Draft | In Review | Approved

## Scope

- Incluso: …
- Escluso: …

## Criteri di accettazione

Elenco degli ID `AC-NNN-xx` coperti da questa issue (dettaglio nella specifica).

- [ ] AC-NNN-01 …

## Test attesi

- Unit: …
- Integration / pgTAP: …
- E2E: …

## Dipendenze

- Bloccata da: #…
- Decisioni PO: OQ-…

## Definition of Ready

- [ ] Scope chiaro
- [ ] Criteri verificabili
- [ ] Dipendenze note
- [ ] Nessuna ambiguità critica aperta
- [ ] Specifica `Approved` (se cambia il comportamento atteso)

## Definition of Done

- [ ] Criteri coperti da test che passano
- [ ] lint, typecheck, format, build verdi
- [ ] Migrazioni riproducibili (`npm run db:reset`) e RLS verificata
- [ ] Security review senza High/Critical aperti
- [ ] Documentazione e tracciabilità aggiornate
- [ ] PR collegata, CI verde
