# Workflow GitHub

- **Stato:** In Review
- **Ultimo aggiornamento:** 2026-10-25
- **Repository:** `matteopelucco/voxuna` (pubblico) · branch predefinito `main`

## Principi

- `main` è protetto **concettualmente**: nessun commit o push diretto, nessun merge senza approvazione
  umana. (Al 2026-10-25 non esiste branch protection remota; abilitarla è una decisione del
  proprietario, vedi [Azioni manuali](#azioni-manuali-del-proprietario).)
- Ogni modifica nasce da una issue e arriva tramite PR piccola e verticale.
- Lo stato di avanzamento vive nelle issue e nella board; il comportamento atteso nelle specifiche.
- Nessuna operazione esterna viene dichiarata eseguita se non è verificata.

## Ciclo di vita di una issue

| Stato board | Ingresso | Uscita |
| --- | --- | --- |
| `Inbox` | Idea o richiesta grezza | Triage del product analyst |
| `Refinement` | Si scrive/raffina la specifica | Spec `Approved` + DoR soddisfatta |
| `Ready` | DoR soddisfatta | Un agente prende in carico l'issue e crea il branch |
| `In Progress` | Branch attivo | PR aperta con CI verde |
| `In Review` | PR in revisione umana | Merge approvato o richiesta di modifiche |
| `Blocked` | Dipendenza o decisione mancante (indicare quale) | Sblocco documentato |
| `Done` | PR mergiata **e** criteri verificati | — |

### Definition of Ready

Scope chiaro · criteri di accettazione verificabili · dipendenze note · nessuna ambiguità critica
aperta · approvazione del product owner se cambia il comportamento atteso.

### Definition of Done

Criteri coperti da test · test, typecheck, lint e build verdi · migrazioni riproducibili con
`db reset` · RLS verificata · security review completata senza High/Critical aperti (o rischio
accettato per iscritto) · documentazione e matrice di tracciabilità aggiornate · nessun segreto ·
PR descritta e collegata all'issue · CI verde.

## Branch e commit

- Branch: `feat/<issue>-<slug>`, `fix/<issue>-<slug>`, `chore/<issue>-<slug>`, `docs/<issue>-<slug>`, `spike/<issue>-<slug>`.
- Commit piccoli, in inglese, [Conventional Commits](https://www.conventionalcommits.org/): `feat(editions): add lock acquisition RPC (#12)`.
- Mai committare segreti, `.env.local`, report, artifact di test, dump o file generati non necessari.
- Niente `--no-verify`, niente force push su branch condivisi.

## Pull request

- Template: [.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md).
- Contenuto obbligatorio: problema, soluzione, spec/requisiti, prova test-first (RED), test eseguiti
  con comandi e risultati reali, migrazioni, rischi di sicurezza, screenshot se UI, rollback, checklist DoD.
- `Closes #N` solo se la PR completa l'issue.
- Una PR = una issue (eccezioni motivate). Feature grandi → PR verticali dipendenti, senza codice morto.
- Nessun merge da parte di Claude Code; l'approvazione umana è obbligatoria.

## Labels

| Label | Uso |
| --- | --- |
| `type:feature`, `type:bug`, `type:chore`, `type:spec`, `type:spike`, `type:docs`, `type:security` | Natura del lavoro |
| `area:tenancy`, `area:auth`, `area:editions`, `area:editor`, `area:locking`, `area:publishing`, `area:songs`, `area:audit`, `area:email`, `area:infra`, `area:ci`, `area:testing` | Dominio |
| `priority:p0` … `priority:p3` | p0 = blocca la milestone; p3 = opportunità |
| `needs:po-decision` | Richiede decisione del product owner (rimanda a `open-questions.md`) |
| `security:finding` | Finding della security review da risolvere |

Le label predefinite di GitHub (`bug`, `documentation`, …) restano disponibili ma non si usano per il triage.

## Milestone

| Milestone | Obiettivo |
| --- | --- |
| M0 — Bootstrap progettuale | Specifiche, agenti, workflow (questa fase) |
| M1 — Fondamenta tecniche | Setup locale riproducibile, Supabase locale, Playwright, CI, baseline di sicurezza |
| M2 — Tenancy, accessi e servizi di base | Organizzazioni, parrocchie, luoghi, auth, ruoli, inviti, email, audit |
| M3 — Edizioni ed editor | Ciclo di vita, editor modulare, lock e autosalvataggio, duplicazione |
| M4 — Rendering e pubblicazione | Template v1, anteprima, HTML/PDF, archivio pubblico |
| M5 — Canti e repertori | Catalogo condiviso/locale, repertori, selezioni |
| M6 — Hardening e rilascio MVP | Review di sicurezza complessiva, accessibilità, prestazioni, go-live |

## Board (GitHub Projects v2)

- Project utente **"Communio"** (owner `matteopelucco`), collegato al repository `voxuna`.
- Campo `Status` con le opzioni: `Inbox`, `Refinement`, `Ready`, `In Progress`, `In Review`, `Blocked`, `Done`.
- Ogni issue ha milestone e stato. Le issue chiuse tramite PR mergiata passano a `Done` (workflow
  integrato del Project "Item closed → Done", da verificare nelle impostazioni del Project).
- I Project esistenti "girasole" e "@matteopelucco's untitled project" **non** sono usati: appartengono ad
  altro o sono vuoti, e non vengono modificati.

### Comandi utili (agenti)

```bash
gh project list --owner matteopelucco
gh project item-list <numero> --owner matteopelucco --format json --limit 200
gh project item-add <numero> --owner matteopelucco --url <issue-url>
gh project field-list <numero> --owner matteopelucco --format json
gh project item-edit --id <item-id> --project-id <project-id> --field-id <status-field-id> --single-select-option-id <option-id>
```

Dopo ogni modifica alla board, rileggere l'item e confermare lo stato effettivo prima di riportarlo.

## CI (prevista, issue #2–#5)

Workflow `.github/workflows/ci.yml` su `pull_request` e `push` su `main`: `npm ci` → lint, typecheck,
format → unit → Supabase locale (`supabase start`, `db reset`, `test db`) → integration → build →
E2E smoke → audit. Permessi del token minimi (`contents: read`). Artifact dei test caricati solo in caso
di fallimento. Nessun segreto di produzione nella CI.

## Azioni manuali del proprietario

Operazioni che Claude Code **non** esegue senza autorizzazione esplicita:

1. **Branch protection / ruleset su `main`** (consigliato dopo la prima CI verde, issue #2):
   Settings → Rules → Rulesets → New branch ruleset → target `main` → richiedere PR, 1 approvazione,
   status check `ci` verde, bloccare force push e cancellazione.
2. **Secret scanning, push protection e private vulnerability reporting:** Settings → Code security →
   abilitare *Secret scanning*, *Push protection* e *Private vulnerability reporting* (gratuiti per
   repository pubblici; quest'ultimo è il canale indicato in [SECURITY.md](../../SECURITY.md)).
3. **Dependabot alerts e security updates:** Settings → Code security → abilitare.
4. **Collegamento Vercel ↔ GitHub** e progetti Supabase hosted: dopo [OQ-10](../product/open-questions.md#oq-10).
5. **Workflow del Project:** nel Project "Communio" → Workflows → verificare "Item closed" → `Done`
   e "Pull request merged" → `Done`.

## Stato operazioni GitHub al bootstrap

Eseguito il 2026-10-25 e **verificato** rileggendo lo stato via `gh`:

| Operazione | Esito |
| --- | --- |
| Labels `type:*`, `area:*`, `priority:*`, `needs:po-decision`, `security:finding` (25) | Create |
| Milestone M0–M6 (numeri 1–7) | Create |
| Issue #1–#17 con milestone e labels | Create |
| Project utente **"Communio"** n. 3 — <https://github.com/users/matteopelucco/projects/3> | Creato e collegato a `matteopelucco/voxuna` |
| Campo `Status`: opzioni sostituite con i 7 stati del workflow | Fatto |
| Issue aggiunte alla board: #1 `In Progress`, #2–#17 `Refinement` | Fatto |
| Branch protection, secret scanning, Dependabot, private vulnerability reporting | **Non eseguiti** (richiedono approvazione: vedi [Azioni manuali](#azioni-manuali-del-proprietario)) |

Da verificare manualmente: le opzioni di `Status` sono state ricreate, quindi i workflow integrati del
Project ("Item closed", "Pull request merged") potrebbero puntare a un'opzione non più esistente.
Aprire Project → ⋯ → Workflows e reimpostarli su `Done`.

### Identificativi per gli agenti

| Elemento | ID |
| --- | --- |
| Project "Communio" | numero `3`, id `PVT_kwHOAAci9M4Boscc` |
| Campo `Status` | `PVTSSF_lAHOAAci9M4BoscczhnLUUM` |
| `Inbox` / `Refinement` / `Ready` | `419a2e1c` / `9f74c022` / `cd92b1a8` |
| `In Progress` / `In Review` / `Blocked` / `Done` | `d0685194` / `57b553be` / `8c120ca1` / `cd4c2bdf` |

Gli ID cambiano se il campo viene ricreato: in caso di errore rileggerli con `gh project field-list 3 --owner matteopelucco --format json`.
