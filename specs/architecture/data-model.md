# Modello dati

- **Stato:** Draft (da validare con le specifiche F-001…F-011)
- **Ultimo aggiornamento:** 2026-10-25
- **Decisioni collegate:** [ADR-0003](adr/0003-isolamento-multi-tenant.md), [ADR-0004](adr/0004-lock-di-modifica-esclusivo.md), [ADR-0005](adr/0005-contenuto-strutturato-e-validato.md), [ADR-0006](adr/0006-snapshot-di-pubblicazione-e-rendering.md)

Modello concettuale. Le tabelle nascono **solo** con la feature che le usa, tramite migrazione
versionata; questo documento si aggiorna nella stessa PR.

## Convenzioni

- Nomi in inglese, `snake_case`, tabelle al plurale. Chiavi primarie `id uuid` (`gen_random_uuid()`).
- `created_at`, `updated_at` (`timestamptz`), `created_by` dove serve per audit.
- Ogni tabella tenant-scoped ha `organization_id uuid not null` (anche se derivabile), per RLS semplice
  e indicizzabile ([ADR-0003](adr/0003-isolamento-multi-tenant.md)).
- Le relazioni tra entità dello stesso tenant usano **FK composite** `(organization_id, id)` per
  impedire riferimenti cross-tenant a livello di vincolo.
- Date di calendario come `date`; orari locali come `time` + timezone della parrocchia; istanti come `timestamptz`.
- Enum PostgreSQL per stati stabili; tabelle di lookup per elenchi configurabili.

## Entità

| Entità | Ambito | Scopo | Note |
| --- | --- | --- | --- |
| `organizations` | tenant (radice) | Tenant = unità pastorale o parrocchia singola: nome, slug, stato (`active`, `suspended`), `publishing_policy` (`restricted` \| `open`), impostazioni. | Decise [OQ-01](../product/open-questions.md#oq-01) e [OQ-02](../product/open-questions.md#oq-02); default della politica da confermare in F-002. |
| `parishes` | tenant | Parrocchia: nome, slug, timezone, `rite`, impostazioni. | |
| `places` | tenant | Luogo di culto: nome breve, parrocchia, indirizzo opzionale. | **Aggiunta** rispetto al mandato: il campione distingue chiese diverse nella stessa parrocchia. |
| `profiles` | globale | Nome visualizzato; 1:1 con `auth.users`. Eventuale `username` univoco. | Visibile solo a membri delle stesse organizzazioni (dato minimo). Username: [OQ-14](../product/open-questions.md#oq-14). |
| `memberships` | tenant | Utente ↔ organizzazione, `role` (`owner`, `admin`, `editor`, `viewer`). Unica per coppia. | Permesso di pubblicazione derivato da `role` + `publishing_policy` ([OQ-02](../product/open-questions.md#oq-02)). |
| `access_requests` | tenant o servizio | Richiesta dal form pubblico: dati minimi del richiedente, organizzazione indicata (o nuova), ruolo richiesto, messaggio, stato (`pending`, `approved`, `rejected`), chi ha deciso e quando. | **Aggiunta** per [OQ-03](../product/open-questions.md#oq-03). Insert solo tramite endpoint server con rate limit; mai leggibile da `anon`. Dettagli in F-002 ([OQ-15](../product/open-questions.md#oq-15)). |
| `parish_memberships` | tenant | Permessi per parrocchia. | **Rinviata**: solo se OQ-02 lo richiede. |
| `invitations` | tenant | Invito: email, ruolo, `token_hash`, scadenza, stato, `accepted_by`. | Token in chiaro solo nell'email; mai nei log. |
| `editions` | tenant | Numero, anno, titolo, `period_start/end`, `status`, `version`, autore. | Più parrocchie via `edition_parishes` (se necessario) o tutte quelle dell'organizzazione. |
| `edition_sections` | tenant | Sezione ordinata: `section_type`, `schema_version`, `position`, `content jsonb`, `version`. | Contenuto validato da schema ([ADR-0005](adr/0005-contenuto-strutturato-e-validato.md)). |
| `celebrations` | tenant | Evento in agenda: data, ora, `place_id`, tipo, `status` (`scheduled`, `cancelled`), intenzioni, note, colore/ricorrenza del giorno. | Tabella separata dalle sezioni per riuso, query per data e duplicazione; da confermare in F-006. |
| `liturgical_days` | tenant | Giorno dell'edizione: data, denominazione, `liturgical_color`. | Possibile aggregazione dentro la sezione `agenda`: decisione in F-006. |
| `edition_locks` | tenant | Una riga per edizione: `user_id`, `session_id`, `acquired_at`, `expires_at`, `heartbeat_at`. | PK = `edition_id`; operazioni solo via RPC. |
| `edition_revisions` | tenant | Snapshot auditabile della bozza (contenuto completo, autore, motivo). | Granularità (ogni salvataggio? a intervalli? a cambio stato?) da definire in F-007. |
| `publications` | tenant, lettura pubblica | Snapshot immutabile: `content jsonb`, `template_version_id`, slug, `published_at`, riferimenti a HTML/PDF, `superseded_by`. | Nessun `UPDATE` del contenuto dopo la creazione (trigger + privilegi). |
| `templates` | servizio | Template: chiave, nome. | Gestiti dal gestore del servizio. |
| `template_versions` | servizio | Versione immutabile del template (codice/asset di riferimento). | |
| `songs` | condiviso o tenant | Titolo, incipit, autori, fonte, temi, momenti, riferimenti biblici, `rights_status`, `lyrics` (testo completo). | `organization_id` **null** = catalogo condiviso. Testi completi ammessi ([OQ-05](../product/open-questions.md#oq-05)); curatela: [OQ-16](../product/open-questions.md#oq-16). |
| `song_repertoires` | condiviso o tenant | Repertorio con nome e visibilità. | |
| `song_repertoire_items` | come il repertorio | Appartenenza canto ↔ repertorio, ordine. | Un repertorio tenant può includere canti condivisi; mai il contrario. |
| `edition_song_selections` | tenant | Canto scelto per momento liturgico (di edizione o celebrazione), ordine, eventuale estratto. | |
| `assets` | tenant | Metadati file su Storage: bucket, path, MIME verificato, dimensione, hash, uploader. | Bucket privati; pubblicazione esplicita degli asset di una pubblicazione. |
| `audit_events` | tenant (o servizio) | Attore, azione, entità, id, timestamp, metadati minimi senza PII superflue. | Append-only. |

## Stati dell'edizione

```text
draft ──submit──▶ in_review ──approve/publish──▶ published ──archive──▶ archived
  ▲                   │                              │
  └──── request changes┘                              └── new revision (draft) ──▶ republish ⇒ nuova publication
```

Le transizioni ammesse si definiscono in F-005. La pubblicazione è consentita in base alla
`publishing_policy` dell'organizzazione ([OQ-02](../product/open-questions.md#oq-02)): con `restricted` solo
ai ruoli abilitati, con `open` a tutti i membri che modificano. La verifica avviene nella funzione di
pubblicazione lato database/server. L'obbligatorietà di `in_review` è in [OQ-13](../product/open-questions.md#oq-13).
Una edizione `published` resta modificabile solo creando una nuova pubblicazione che **sostituisce**
(`superseded_by`) la precedente, senza alterarla.

## Vincoli da garantire (oltre alle FK)

- Unicità: `organizations.slug`; `(organization_id, parishes.slug)`; `(organization_id, year, number)` per le edizioni (da confermare con OQ-07).
- `period_end >= period_start`; durata massima ragionevole (proposta: 31 giorni).
- `edition_sections.position` unica per edizione (vincolo differibile per i riordini).
- Una sola pubblicazione **corrente** per edizione (indice univoco parziale).
- Le RPC di lock e le mutazioni verificano `version` atteso ([ADR-0004](adr/0004-lock-di-modifica-esclusivo.md)).

## Questioni di modellazione da chiudere nelle feature

1. `celebrations` e `liturgical_days` come tabelle o come contenuto della sezione `agenda` (F-006).
2. Edizione multi-parrocchia: tabella ponte o implicita sull'organizzazione (F-001/F-005).
3. Granularità di `edition_revisions` (F-007).
4. Template come codice versionato nel repository vs. dati in DB (F-009).
