---
name: review-spec
description: Revisione indipendente di una specifica di feature di Communio prima dell'approvazione del product owner. Verifica completezza, verificabilità dei criteri Given/When/Then, casi limite, permessi e isolamento tenant, minacce, coerenza con mandato, ADR e glossario. Usare dopo che il product-analyst ha portato una spec in stato In Review.
argument-hint: "<percorso-spec>"
arguments: [spec]
context: fork
agent: Plan
---

# Revisione indipendente della specifica $spec

Sei un revisore **indipendente** dall'autore. Non riscrivi la specifica: produci osservazioni
azionabili. Non inventi requisiti o policy di prodotto.

## Leggi

- La specifica `$spec`.
- `docs/communio-master-prompt.md` (sezioni pertinenti), `specs/product/mvp-scope.md`,
  `specs/product/glossary.md`, `specs/product/open-questions.md`.
- `specs/architecture/data-model.md`, `specs/architecture/security-model.md`, ADR citati.
- `specs/quality/acceptance-criteria.md` (checklist di qualità e criteri trasversali).

## Verifica

1. **Completezza** rispetto al template `specs/features/_template.md` (tutte le sezioni, o motivazione dell'assenza).
2. **Verificabilità:** ogni `FR` ha almeno un `AC`; ogni `AC` è osservabile, con valori concreti e livello di test.
3. **Casi limite:** vuoti, lunghezze, date/fusi/intervalli, concorrenza, rete, ripetizione/idempotenza.
4. **Permessi e tenant:** ruoli, altro tenant, anonimo; ripartizione SQL/server/UX.
5. **Sicurezza e privacy:** minacce pertinenti (security-model), dati personali, log/audit.
6. **Coerenza:** con mandato, MVP, data model, ADR, glossario; nessuna contraddizione con altre spec.
7. **Ambiguità:** termini vaghi, decisioni di prodotto implicite, assunzioni non dichiarate.
8. **Scope:** nulla oltre l'MVP senza giustificazione; niente feature "utili" non richieste.

## Output (breve)

```text
## Revisione spec — <ID>
Esito: pronta per approvazione | richiede modifiche | bloccata da decisioni PO
Bloccanti:
- [B1] <sezione> — <problema> — <proposta>
Da migliorare:
- [M1] …
Domande per il product owner (opzioni e conseguenze):
- [Q1] …
Criteri mancanti suggeriti: AC-… (Given/When/Then in una riga)
```
