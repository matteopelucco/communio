# Criteri di accettazione

- **Stato:** In Review
- **Ultimo aggiornamento:** 2026-10-25

## Formato

Ogni criterio ha un ID stabile `AC-<feature>-<nn>` (es. `AC-007-03`) e segue Given/When/Then:

```gherkin
AC-007-03 — Scrittura rifiutata dopo la scadenza del lock
  Given un redattore che possedeva il lock dell'edizione E
    And il lock è scaduto da più di 90 secondi
  When invia un salvataggio della sezione S con la versione attesa corrente
  Then il server rifiuta il salvataggio con errore "lock_expired"
    And il contenuto di S non cambia
    And l'editor mostra "Hai perso il diritto di modifica" e passa in sola lettura
```

Regole:

- Un comportamento osservabile per criterio; niente "e inoltre" che nasconde un secondo criterio.
- Valori concreti (tempi, ruoli, testi d'errore chiave) invece di aggettivi ("veloce", "chiaro").
- Includere sempre: happy path, errori di validazione, permessi (ruolo insufficiente, altro tenant,
  anonimo), concorrenza dove rilevante, comportamento offline/errore di rete per stati di salvataggio.
- Ogni criterio indica il livello di test previsto (unit, integration, pgTAP, E2E).
- I nomi dei test includono l'ID del criterio (es. `test('AC-007-03 rejects save after lock expiry', …)`).

## Criteri trasversali (si applicano a ogni feature, salvo esclusione motivata)

| ID | Criterio |
| --- | --- |
| AC-X-01 | Un utente di un'altra organizzazione non può leggere, creare, modificare o cancellare le entità della feature (pgTAP + integrazione). |
| AC-X-02 | Un utente anonimo non può accedere a dati non pubblicati della feature. |
| AC-X-03 | Ogni mutazione con input invalido è rifiutata dal server con messaggio comprensibile in italiano, anche se la UI è stata aggirata. |
| AC-X-04 | Nessuno stato "salvato/pubblicato/inviato" è mostrato prima della conferma del server; un errore è visibile e permette di riprovare. |
| AC-X-05 | Le azioni principali sono eseguibili da tastiera, con focus visibile e label accessibili; nessuna violazione axe di livello serio/critico. |
| AC-X-06 | Gli eventi rilevanti per l'audit sono registrati senza token né PII superflue. |
| AC-X-07 | Nessun segreto o dato privato è incluso nel bundle client o nelle risposte non necessarie. |

## Checklist di qualità di una specifica (per `/review-spec`)

- [ ] Problema, attori e non-obiettivi espliciti.
- [ ] Requisiti `FR-xxx` numerati e verificabili.
- [ ] Ogni FR ha almeno un criterio `AC-…`.
- [ ] Casi limite: vuoti, limiti di lunghezza, date (fusi, cambio ora, intervalli), concorrenza, errori di rete.
- [ ] Permessi per ruolo e isolamento tenant.
- [ ] Contratti dati/API ed effetti collaterali (audit, email, realtime).
- [ ] Minacce e controlli; ripartizione SQL/server/UX.
- [ ] Dati di test e strategia.
- [ ] Questioni aperte e assunzioni dichiarate; nessuna policy di prodotto inventata.
