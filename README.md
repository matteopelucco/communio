# Communio

> La liturgia, insieme.

**Communio** è un'applicazione SaaS multi-tenant per preparare, redigere, impaginare e pubblicare
bollettini parrocchiali e agende liturgiche settimanali. Il repository si chiama `voxuna`.

> **Stato:** bootstrap progettuale. Le specifiche MVP sono in attesa di approvazione del product
> owner; non esiste ancora codice applicativo.

## Orientamento

| Cosa | Dove |
| --- | --- |
| Mandato di progetto (contratto) | [docs/communio-master-prompt.md](docs/communio-master-prompt.md) |
| Specifiche (fonte di verità) | [specs/](specs/README.md) |
| Decisioni architetturali (ADR) | [specs/architecture/adr/](specs/architecture/adr/README.md) |
| Roadmap e backlog | [specs/backlog/roadmap.md](specs/backlog/roadmap.md) |
| Questioni aperte per il product owner | [specs/product/open-questions.md](specs/product/open-questions.md) |
| Workflow GitHub (branch, PR, board) | [specs/operations/github-workflow.md](specs/operations/github-workflow.md) |
| Sviluppo locale | [specs/architecture/local-development.md](specs/architecture/local-development.md) |
| Istruzioni operative per Claude Code | [CLAUDE.md](CLAUDE.md), [.claude/](.claude/) |
| Sicurezza | [SECURITY.md](SECURITY.md) |

## Stack previsto

Next.js (App Router) · React · TypeScript strict · Tailwind CSS v4 · Supabase (PostgreSQL, Auth,
RLS, Realtime, Storage) · Vercel · Resend · Vitest · Playwright · npm.

Dettagli e versioni: [ADR-0002](specs/architecture/adr/0002-stack-tecnologico-di-base.md).

## Avvio rapido

Il setup eseguibile (`npm run dev`, Supabase locale, test) viene introdotto dall'issue
**#2 — Setup locale riproducibile e CI minima**. Fino ad allora il repository contiene solo
documentazione e configurazione di workflow.

Prerequisiti previsti: Node.js 24 LTS, npm, Docker (o runtime compatibile) in esecuzione,
Git, GitHub CLI (`gh`) per il workflow.

## Contribuire

Il lavoro procede **spec → test → codice → review → PR**, una issue alla volta. Nessun commit diretto
su `main`, nessun merge senza approvazione umana. Vedi
[specs/operations/github-workflow.md](specs/operations/github-workflow.md).

## Licenza

[MIT](LICENSE).
