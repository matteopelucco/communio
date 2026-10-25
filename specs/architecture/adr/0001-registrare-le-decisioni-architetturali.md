# 0001 — Registrare le decisioni architetturali

- **Stato:** Accepted (richiesto dal mandato §4.5)
- **Data:** 2026-10-25

## Contesto e problema

Il progetto è sviluppato con agenti AI e revisione umana. Le decisioni prese in chat si perdono; il
mandato richiede che lo stato durevole viva nel repository.

## Decisione

Le decisioni architetturali non ovvie si registrano come ADR in `specs/architecture/adr/`, formato MADR
semplificato, numerazione progressiva. Le decisioni che richiedono validazione nascono `Proposed`. Un ADR
`Accepted` non si riscrive: si sostituisce con un nuovo ADR.

## Conseguenze

- Tracciabilità delle scelte e dei trade-off; contesto disponibile a nuovi agenti e persone.
- Costo: disciplina nel mantenere l'indice aggiornato nella stessa PR della decisione.
