# 0004 — Lock di modifica esclusivo per edizione

- **Stato:** Proposed
- **Data:** 2026-10-25
- **Spec:** F-007 · Mandato §8

## Contesto e problema

Più redattori possono aprire la stessa edizione. La collaborazione in tempo reale (CRDT) è fuori scope.
Serve impedire sovrascritture e rendere chiaro chi sta modificando.

## Opzioni considerate

1. **Lease esclusivo per edizione, legato a una sessione di tab, con heartbeat e scadenza** (scelta proposta).
2. Solo optimistic concurrency senza lock: conflitti frequenti e frustranti per redattori non tecnici.
3. Advisory lock PostgreSQL: legati alla connessione, inadatti a richieste HTTP stateless.
4. CRDT (es. Yjs): complessità e superficie fuori scope MVP.

## Decisione proposta

- Tabella `edition_locks` (PK `edition_id`) modificabile **solo** tramite RPC `acquire_edition_lock`, `renew_edition_lock`, `release_edition_lock`; nessun privilegio diretto di scrittura.
- `session_id`: UUID v4 generato per tab, conservato in `sessionStorage` (una nuova tab = nuova sessione).
- Acquisizione atomica: `insert … on conflict (edition_id) do update … where edition_locks.expires_at < now() or (user_id, session_id) = (caller)`; il risultato indica se il lock è ottenuto e, altrimenti, il display name del proprietario.
- Parametri iniziali: **heartbeat 30 s, scadenza 90 s** (tolleranza a due heartbeat persi), configurabili.
- Rilascio esplicito best-effort (`pagehide` + `fetch keepalive`); la scadenza è il recupero principale.
- Ogni mutazione di contenuto ricontrolla in SQL: utente, membership, sessione proprietaria del lock non scaduto, `version` atteso; incrementa `version`.
- Realtime su canale privato per organizzazione/edizione: solo stato del lock (id utente, display name, scadenza).

## Trade-off

| Scadenza | Pro | Contro |
| --- | --- | --- |
| Breve (es. 45 s) | Lock abbandonati liberati presto | Perdita del lock con reti instabili |
| 90 s (proposta) | Tollera 2 heartbeat persi | Attesa fino a 90 s dopo chiusura brusca |
| Lunga (5 min) | Robusta | Blocchi lunghi e confusione |

## Conseguenze

- Implementazione semplice e testabile; nessuna dipendenza aggiuntiva.
- Un utente con due tab vede la seconda in sola lettura (comportamento voluto, da comunicare in UI).
- Possibile "presa in carico" forzata da un admin: **non** inclusa, da valutare in F-007.

## Validazione

Test di integrazione con acquisizioni concorrenti ripetute (N tentativi paralleli → esattamente un vincitore),
test di scrittura dopo expiry rifiutata, E2E con due contesti browser.
