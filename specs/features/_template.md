# F-NNN — Titolo della feature

| Campo | Valore |
| --- | --- |
| ID | F-NNN |
| Stato | Draft \| In Review \| Approved \| Implemented \| Deprecated |
| Requisiti MVP | MVP-xx |
| Issue | #N |
| Autore / ultimo aggiornamento | … / AAAA-MM-GG |
| Approvazione | product owner, data — oppure "in attesa" |
| ADR collegati | … |

## 1. Contesto e problema utente

## 2. Obiettivo e non-obiettivi

**Obiettivo:** …

**Non-obiettivi:** …

## 3. Attori, ruoli e prerequisiti

| Attore/ruolo | Può | Non può |
| --- | --- | --- |

## 4. Flussi

### 4.1 Flusso principale

1. …

### 4.2 Flussi alternativi e di errore

- …

## 5. Requisiti funzionali

- **FR-001** …

## 6. Requisiti non funzionali

Sicurezza, accessibilità, prestazioni, affidabilità, privacy (riferire `NFR-xx` dove applicabile).

## 7. Criteri di accettazione

```gherkin
AC-NNN-01 — Titolo
  Given …
  When …
  Then …
```

Livello di test per ogni criterio: unit / integration / pgTAP / E2E. Criteri trasversali `AC-X-xx` applicabili: …

## 8. Casi limite, validazioni, errori e concorrenza

## 9. Contratti API/database ed effetti collaterali

Tabelle, colonne, RPC, policy RLS, eventi realtime, email, audit.

## 10. Logging e audit

Eventi registrati, campi, esclusioni di PII e token.

## 11. Strategia e dati di test

## 12. Minacce e controlli di sicurezza

| Minaccia | Controllo | Livello (SQL/server/UX) | Test |
| --- | --- | --- | --- |

## 13. Migrazione, compatibilità e rollback

## 14. Questioni aperte e assunzioni

| ID | Questione/assunzione | Bloccante? | Stato |
| --- | --- | --- | --- |

## 15. Collegamenti

| Criterio | File di test | PR |
| --- | --- | --- |
