## Issue

Closes #N

Usare `Refs #N` se la PR non completa l'issue.

## Problema

Perché questa modifica.

## Soluzione

Cosa cambia, in sintesi. Decisioni rilevanti e ADR (`specs/architecture/adr/…`).

## Specifica e requisiti

- Spec: `specs/features/F-NNN-….md` (stato: Approved)
- Requisiti: `MVP-xx`, criteri `AC-NNN-xx` coperti

## Test-first (prova del RED)

```text
<comando>
<falliti>/<totali> — motivi attesi (una riga per test)
```

## Verifiche eseguite (risultati reali)

| Comando | Esito |
| --- | --- |
| `npm run lint` | |
| `npm run typecheck` | |
| `npm run format:check` | |
| `npm run test:unit` | |
| `npm run test:integration` | |
| `npm run test:e2e:smoke` | |
| `npm run build` | |

## Migrazioni e dati

- Migrazioni: nessuna | `supabase/migrations/…` (riproducibili con `npm run db:reset`: sì/no)
- Seed/fixture modificati: …

## Sicurezza

- Review: `docs/security/reviews/…` — finding aperti: nessuno | …
- Superfici toccate: RLS, RPC, auth, storage, rendering, email, …

## UI

Screenshot desktop/mobile se cambia l'interfaccia (dati sintetici).

## Rollback

Come annullare la modifica (revert, migrazione inversa, flag).

## Checklist Definition of Done

- [ ] Criteri di accettazione coperti da test che passano
- [ ] lint, typecheck, format, build verdi; CI verde
- [ ] Migrazioni riproducibili; RLS verificata con test negativi cross-tenant
- [ ] Security review completata, nessun High/Critical aperto
- [ ] Spec, ADR, documentazione e `specs/quality/traceability.md` aggiornati
- [ ] Nessun segreto, nessun dato personale reale, nessun artifact di test
