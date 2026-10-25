# 0006 — Snapshot di pubblicazione e rendering

- **Stato:** Proposed (la parte PDF dipende dallo spike #14)
- **Data:** 2026-10-25
- **Spec:** F-009, F-010 · Mandato §9

## Contesto e problema

Le pubblicazioni devono essere immutabili; HTML e PDF devono derivare dalla stessa versione approvata;
l'anteprima in editing deve somigliare al risultato finale.

## Decisione proposta

- Alla pubblicazione si crea una riga `publications` con **copia completa** del contenuto validato
  (`content jsonb`), `template_version_id`, `schema_version` e metadati; la riga non è aggiornabile nel
  contenuto (privilegi + trigger).
- Un unico renderer React (componenti del template) produce: anteprima in editing, pagina HTML pubblica
  e HTML di stampa per il PDF. CSS di stampa separato solo dove necessario (`@media print`, `@page`).
- PDF generato da Chromium headless a partire dallo snapshot. **Opzione da validare** con lo spike #14:
  - A. Chromium in funzione serverless Vercel (es. pacchetto Chromium per serverless + `playwright-core`);
  - B. worker/servizio separato (costo e operatività da documentare);
  - C. generazione nel job di pubblicazione con salvataggio su Storage (comunque necessario per cache).
- Il PDF è generato una volta e salvato su Storage; le richieste pubbliche servono il file, non rigenerano.
- Template come codice versionato nel repository; `template_versions` registra la versione usata
  (decisione da confermare in F-009).

## Conseguenze

- Coerenza HTML/PDF per costruzione; ripubblicare crea una nuova pubblicazione.
- Rischio principale: limiti di dimensione/memoria/timeout di Vercel → nessuna dichiarazione di
  compatibilità prima dello spike.
