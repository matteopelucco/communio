---
name: work-on-issue
description: Porta una issue GitHub di Communio dalla verifica della Definition of Ready fino a una PR pronta per la revisione umana, orchestrando in sequenza product-analyst, architect-engineer, test-engineer e security-reviewer. Usare quando si inizia a lavorare su una issue specifica.
argument-hint: "<numero-issue>"
arguments: [issue]
---

# Lavorare sulla issue #$issue

Sei l'**orchestratore**. Segui l'ordine del mandato (§0, §5). Una issue alla volta; mai due agenti in
scrittura sugli stessi file o branch. Fermati e chiedi ai gate indicati.

## 0. Contesto

```bash
gh issue view $issue --json number,title,body,labels,milestone,state
git status --short && git branch --show-current
```

Leggi la spec collegata nell'issue e gli ADR citati. Se l'issue è di tipo `spec`, salta al passo 1 e
termina al passo 2 (il prodotto della issue è la specifica approvata).

## 1. Specifica (agente `product-analyst`)

- Se la spec non esiste o non è `Approved`: delega al `product-analyst` la stesura/raffinamento.
- Poi esegui `/review-spec <percorso-spec>` per una revisione indipendente.
- Se emergono questioni bloccanti: aggiorna `open-questions.md`, label `needs:po-decision`, board `Blocked`. **Fermati.**

## 2. Gate del product owner

Se la spec cambia il comportamento atteso, presenta all'utente: sintesi, criteri, questioni aperte.
**Attendi approvazione esplicita.** Registra data e fonte dell'approvazione nella spec (stato `Approved`).

## 3. Definition of Ready e branch

- Verifica DoR (`specs/operations/github-workflow.md`). Se manca qualcosa: fermati e riporta.
- Crea il branch `feat|fix|chore|docs|spike/$issue-<slug>` da `main` aggiornato.
- Board → `In Progress` (verifica l'esito con `gh project item-list`).

## 4. Piano tecnico (agente `architect-engineer`, modalità piano)

Piano breve + ADR se necessario. Se il piano è ampio o cambia decisioni `Accepted`, mostralo all'utente prima di procedere.

## 5. RED (agente `test-engineer`)

Test derivati dai criteri `AC-…`; prova del fallimento per il motivo atteso. Segui `/tdd-cycle`.

## 6. GREEN e REFACTOR (agente `architect-engineer`, modalità implementazione)

Codice minimo, poi refactoring. Se l'implementer contesta un test, risolvi passando da spec e test-engineer.

## 7. Verifica (agente `test-engineer`)

Suite mirata, regressioni, poi `npm run verify` (o i check DoD applicabili).

## 8. Security review (agente `security-reviewer`)

Review del diff e report in `docs/security/reviews/`. High/Critical aperti ⇒ **la PR non è pronta**:
torna al passo 6 o chiedi accettazione del rischio documentata.

## 9. Chiusura

- Aggiorna spec (collegamenti), `specs/quality/traceability.md`, documentazione e ADR.
- Esegui `/prepare-pr` per commit, push del branch e PR. Board → `In Review`.
- **Non fare merge.**

## Report finale (formato mandato §19)

Issue/feature · Spec (percorsi e stato) · Decisioni (ADR) · Test-first (prova RED) · Implementazione
(file/aree) · Verifiche (comandi reali, esiti, conteggi) · Sicurezza (esito e finding aperti) · GitHub
(branch, commit, PR, board realmente aggiornati) · Rischi/blocchi · Prossimo passo (una issue).
