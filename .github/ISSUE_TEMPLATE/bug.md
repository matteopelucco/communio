---
name: Bug
about: Comportamento che non rispetta la specifica approvata
title: "bug: <sintesi>"
labels: ["type:bug"]
---

## Comportamento atteso

Riferimento alla specifica e al criterio (`specs/features/F-NNN-…`, `AC-NNN-xx`).

## Comportamento osservato

Cosa succede, con messaggi d'errore (senza segreti, token o dati personali).

## Passi per riprodurre

1. …

## Ambiente

Local | CI | Preview | Production — commit/versione — browser.

## Impatto

Utenti coinvolti, dati a rischio, workaround. **Se riguarda sicurezza o dati di altri tenant, non
descrivere i dettagli qui (repository pubblico): contatta il responsabile in privato.**

## Definition of Done

- [ ] Test di regressione che fallisce prima della correzione
- [ ] Correzione con CI verde
- [ ] Spec aggiornata se l'aspettativa era ambigua
