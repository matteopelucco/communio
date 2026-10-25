---
name: prepare-pr
description: Verifica la Definition of Done di Communio sul branch corrente, crea commit puliti, pubblica il branch e apre una pull request completa (problema, soluzione, spec, prova RED, test reali, migrazioni, sicurezza, rollback). Non fa merge. Usare quando una issue è implementata e verificata.
argument-hint: "[numero-issue]"
---

# Preparare la pull request

Template: `.github/PULL_REQUEST_TEMPLATE.md`. Workflow: `specs/operations/github-workflow.md`.

## 1. Controlli preliminari

```bash
git branch --show-current          # deve essere tipo/<issue>-slug, mai main
git status --short
git diff main...HEAD --stat
```

- Nessun file non voluto: `.env*` (tranne `.env.example`), `artifacts/`, report, dump, file del
  materiale di riferimento privato, file generati non necessari.
- Cerca segreti nel diff (chiavi, token, `service_role`, URL con credenziali). Se trovati: **fermati**.

## 2. Definition of Done (esegui, non presumere)

Esegui i comandi applicabili e annota esito e conteggi **reali**:

| Check | Comando |
| --- | --- |
| Lint / format / typecheck | `npm run lint`, `npm run format:check`, `npm run typecheck` |
| Unit / integration / DB | `npm run test:unit`, `npm run test:integration` |
| Migrazioni riproducibili | `npm run db:reset` |
| E2E | `npm run test:e2e:smoke` o `npm run test:e2e` |
| Build | `npm run build` |
| Tutto | `npm run verify` |
| Task solo documentali | `npx --yes markdownlint-cli2@0.24.0`, verifica dei link e dei comandi citati |

Verifica inoltre: security review presente in `docs/security/reviews/` senza High/Critical aperti
(o accettazione documentata); spec, ADR e `specs/quality/traceability.md` aggiornati.

Se un check fallisce: non aprire la PR come pronta. Riporta il fallimento; al più apri una **draft PR** dichiarandolo.

## 3. Commit

Commit piccoli in inglese, Conventional Commits, con riferimento all'issue
(`feat(locking): add lease renewal rpc (#12)`). Niente `--no-verify`, niente amend di commit già pubblicati.

## 4. Push e PR

```bash
git push -u origin <branch>
gh pr create --base main --title "<tipo>: <sintesi> (#<issue>)" --body-file <file-temporaneo>
```

Compila il corpo dal template con dati reali. Usa `Closes #<issue>` solo se la PR completa l'issue.
Verifica la PR creata con `gh pr view --json number,url,state,isDraft` e aggiorna la board a `In Review`
(rileggendo lo stato).

## 5. Divieti

Nessun merge (`gh pr merge` è bloccato dagli hook), nessun push su `main`, nessun deploy.

## Output

```text
PR: #<n> <url> (draft: sì/no)
Branch: <nome> · Commit: <n>
DoD: <check> ok/ko …
Board: In Review (verificato) | non aggiornata: <motivo + comando manuale>
```
