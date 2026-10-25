# 0003 — Isolamento multi-tenant con `organization_id` e RLS

- **Stato:** Proposed
- **Data:** 2026-10-25
- **Dipende da:** [OQ-01](../../product/open-questions.md#oq-01), decisa il 2026-10-25: organizzazione = unità pastorale, coerente con questo ADR
- **Spec:** F-001

## Contesto e problema

Il rischio principale del prodotto è la fuga o la modifica di dati tra parrocchie di organizzazioni
diverse. Serve un modello di isolamento semplice, verificabile e applicato dal database.

## Opzioni considerate

1. **Database condiviso, `organization_id` su ogni tabella tenant-scoped, RLS** (scelta proposta).
2. Schema PostgreSQL per tenant: isolamento più forte ma migrazioni moltiplicate, incompatibile con l'uso standard di Supabase.
3. Progetto Supabase per tenant: costi e operatività proibitivi.
4. `organization_id` solo sulle tabelle radice, ereditato via join nelle policy: meno ridondanza ma policy lente e fragili.

## Decisione proposta

- `organization_id not null` su **ogni** tabella tenant-scoped, anche se derivabile.
- FK composite `(organization_id, id)` tra entità tenant-scoped per rendere impossibili riferimenti cross-tenant.
- RLS abilitata su tutte le tabelle in `public`; policy separate per `select/insert/update/delete`.
- Funzioni helper `STABLE SECURITY DEFINER` con `set search_path = ''`: `app.is_member(org_id)`, `app.has_role(org_id, roles[])`, basate su `auth.uid()`.
- Indici su `organization_id` e sulle colonne usate dalle policy.
- Revoca dei privilegi di default ad `anon`; `anon` accede solo a viste/policy pubbliche delle pubblicazioni.
- Il catalogo condiviso dei canti usa `organization_id null` + policy dedicate (lettura per tutti gli autenticati, scrittura solo `service_admin`).

## Conseguenze

- Positive: un unico meccanismo, testabile con pgTAP; query semplici.
- Negative: ridondanza di `organization_id`, da mantenere coerente (garantito dalle FK composite).
- Rischio: policy mancante su una nuova tabella → mitigato da test che verificano RLS abilitata su tutte le tabelle `public`.

## Validazione

Test pgTAP con due organizzazioni e utenti di ruoli diversi: ogni operazione cross-tenant fallisce.
