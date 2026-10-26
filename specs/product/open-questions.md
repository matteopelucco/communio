# Questioni aperte per il product owner

- **Ultimo aggiornamento:** 2026-10-25

Ogni questione indica cosa blocca, le opzioni con conseguenze e una raccomandazione. Le decisioni
prese si registrano qui (stato `Decisa`, con data e fonte) e si propagano a specifiche e ADR. Quando
una risposta richiede un'interpretazione, l'interpretazione è scritta esplicitamente e va confermata
nella specifica di feature: non è una decisione nuova.

## Riepilogo

| ID | Questione | Blocca | Stato |
| --- | --- | --- | --- |
| [OQ-01](#oq-01) | Corrispondenza tra organizzazione (tenant) e unità pastorale | F-001, data model | **Decisa** (2026-10-25) |
| [OQ-02](#oq-02) | Ruoli e chi può pubblicare | F-002, F-005 | **Decisa** (2026-10-25), con interpretazioni da confermare |
| [OQ-03](#oq-03) | Metodo di autenticazione e modalità di accesso | F-002 | **Decisa** (2026-10-25) |
| [OQ-04](#oq-04) | Pubblicazione di intenzioni e recapiti personali | F-006, F-010 | **Decisa** (2026-10-25) |
| [OQ-05](#oq-05) | Testi dei canti: memorizzazione e pubblicazione | F-011 | **Decisa** (2026-10-25), con interpretazione da confermare |
| [OQ-06](#oq-06) | Visibilità dell'archivio pubblico, URL e indicizzazione | F-010 | **Decisa** (2026-10-26, "per ora"), con interpretazione da confermare |
| [OQ-07](#oq-07) | Regola di numerazione delle edizioni | F-005 | Aperta, non bloccante ora |
| [OQ-08](#oq-08) | Riti da supportare nell'MVP | F-006 | Aperta, non bloccante ora |
| [OQ-09](#oq-09) | Conservazione e cancellazione dei dati (retention) | Produzione | Aperta, prima del go-live |
| [OQ-10](#oq-10) | Dominio, account Vercel/Supabase/Resend e titolarità | Preview/Production | Aperta, prima del primo deploy |
| [OQ-11](#oq-11) | Materiale di riferimento con dati personali | Repository | **Decisa** (2026-10-25) |
| [OQ-12](#oq-12) | Nome del prodotto | Documentazione | **Decisa** (2026-10-25) |
| [OQ-13](#oq-13) | Stato "in revisione" obbligatorio o facoltativo | F-005 | **Decisa** (2026-10-26) |
| [OQ-14](#oq-14) | Identificativo di accesso: username distinto o email | F-002 | **Decisa** (2026-10-26) |
| [OQ-15](#oq-15) | Richiesta di accesso: chi la gestisce e come diventa un account | F-002 | **Decisa** (2026-10-26, "per ora"); dettagli in F-002 |
| [OQ-16](#oq-16) | Curatela del catalogo condiviso dei canti e licenze | F-011 | **Decisa** (2026-10-26); dettagli in F-011 |

---

## OQ-01

**Corrispondenza tra organizzazione (tenant) e unità pastorale.**

**Decisa il 2026-10-25 dal product owner: opzione A.** Un'organizzazione corrisponde a un'unità
pastorale (o a una parrocchia singola). Le edizioni appartengono all'organizzazione e possono
riguardare tutte le sue parrocchie.

Conseguenze:

- Isolamento e RLS su `organization_id` ([ADR-0003](../architecture/adr/0003-isolamento-multi-tenant.md)).
- Una diocesi con più unità pastorali corrisponde a più organizzazioni.
- `parish_memberships` resta rinviata finché non emerge un'esigenza di permessi per singola parrocchia.
- Il livello sovraordinato (opzione B) resta un'estensione futura con migrazione.

<details>
<summary>Opzioni valutate</summary>

| Opzione | Conseguenze |
| --- | --- |
| A. **Organizzazione = unità pastorale** (o parrocchia singola) | Scelta. |
| B. Organizzazione = ente sovraordinato con più unità pastorali | Livello `pastoral_units` in più, RLS più complessa. |
| C. Come A, con bollettini propri per singola parrocchia | Ambito dell'edizione variabile. |

</details>

## OQ-02

**Ruoli e chi può pubblicare.**

**Decisa il 2026-10-25 dal product owner.** La politica di pubblicazione è un'impostazione
dell'organizzazione, scelta dal titolare, con due opzioni:

1. **Pubblicazione riservata** (`restricted`): pubblica solo chi ha un ruolo con il permesso di pubblicazione.
2. **Pubblicazione aperta** (`open`): pubblicano tutti.

Interpretazioni registrate, da confermare nelle specifiche F-002 e F-005:

| Punto | Interpretazione proposta |
| --- | --- |
| Chi è il "titolare" | Il ruolo `owner` dell'organizzazione (organizzazione = unità pastorale, OQ-01). Solo l'`owner` cambia la politica. |
| Chi sono "tutti" in `open` | I membri che possono modificare le edizioni (`editor`, `admin`, `owner`), **non** i `viewer`. |
| Chi ha il permesso in `restricted` | `owner` e `admin`. |
| Valore predefinito | Da decidere alla creazione dell'organizzazione; proposta `restricted`. |
| Applicazione | Verificata lato server/database a ogni pubblicazione, non solo nascondendo il pulsante. Il cambio di politica è un evento di audit. |

Ruoli proposti per organizzazione (invariati): `owner`, `admin`, `editor`, `viewer`. La revisione
prima della pubblicazione è facoltativa ([OQ-13](#oq-13), decisa).

## OQ-03

**Metodo di autenticazione e modalità di accesso.**

**Decisa il 2026-10-25 dal product owner:**

- accesso con **username e password**;
- **nessuna registrazione libera**;
- un **form pubblico di richiesta di accesso** sostituisce l'iscrizione: chi vuole accedere lo compila
  e la richiesta viene valutata prima di creare l'account.

Conseguenze:

- Magic link e login social sono esclusi dall'MVP.
- Servono policy delle password, recupero dell'accesso e limitazione dei tentativi.
- Il form pubblico è una superficie non autenticata: protezione da abuso e spam, nessuna enumerazione
  degli account, raccolta minima di dati ([security-model](../architecture/security-model.md)).

Dettagli decisi successivamente: lo username è l'email ([OQ-14](#oq-14)); le richieste sono approvate
dal gestore del servizio ([OQ-15](#oq-15)).

## OQ-04

**Pubblicazione di intenzioni e recapiti personali.**

**Decisa il 2026-10-25 dal product owner: opzione A.** Intenzioni e recapiti si pubblicano in HTML e
in PDF come nel bollettino cartaceo. La scelta dei contenuti e la responsabilità della loro
pubblicazione sono dell'ente. Motivazione del product owner: il foglio è già pubblico, stampato e
distribuito gratuitamente in ogni chiesa.

Conseguenze:

- HTML e PDF hanno lo stesso contenuto, senza omissioni dedicate (coerente con [ADR-0006](../architecture/adr/0006-snapshot-di-pubblicazione-e-rendering.md)).
- Il prodotto non aggiunge dati personali oltre a quelli inseriti dal redattore.
- L'indicizzazione delle pagine pubbliche non dipende più da questo tema: resta in [OQ-06](#oq-06).
- La minimizzazione dei dati resta valida per i dati degli utenti dell'applicazione (profili, log, audit, richieste di accesso).

## OQ-05

**Testi dei canti.**

**Decisa il 2026-10-25 dal product owner: "sì".**

Interpretazione registrata, da confermare in F-011: sì alle domande 1 e 2, cioè:

- il catalogo può memorizzare i testi completi dei canti;
- l'edizione può riportarne il testo, come nel campione.

Vincoli del mandato che restano validi (§7):

- registrare fonte e stato dei diritti quando rilevante;
- non importare automaticamente testi integrali da fonti non autorizzate.

Curatela del catalogo condiviso: gestore del servizio ([OQ-16](#oq-16), decisa).

## OQ-06

**Archivio pubblico, URL e indicizzazione.**

**Decisa il 2026-10-26 dal product owner, "per ora":** l'archivio è pubblico e i fogli pubblicati sono
visibili a tutti. "Per ora" indica una scelta valida per l'MVP e rivedibile: il modello non deve
impedire una futura visibilità diversa (es. "non in elenco"), ma l'MVP non la implementa.

Interpretazioni e proposte da confermare in F-010:

| Punto | Proposta |
| --- | --- |
| Indicizzazione | Pagine pubbliche indicizzabili (nessun `noindex`), coerente con "visibili a tutti". |
| Schema degli URL | `/{org-slug}/edizioni/{anno}/{numero}`, con archivio elencato per organizzazione. |
| Opzione "non in elenco" | Rinviata, fuori dall'MVP. |

Restano invariati i vincoli: solo pubblicazioni pubblicate sono accessibili ad `anon`, mai le bozze,
e un URL non è una forma di autorizzazione.

## OQ-07

**Numerazione delle edizioni.** "Anno XII – N. 6": l'anno è progressivo dalla fondazione del
bollettino; il numero si azzera a inizio anno solare, a inizio anno pastorale (settembre) o in altro
modo? Proposta: numero e anno modificabili, con suggerimento automatico dal precedente.

## OQ-08

**Riti da supportare.** Il campione è ambrosiano. Proposta: impostazione `rite` per parrocchia con
`ambrosian` e `roman`; i momenti liturgici proposti dipendono dal rito; nessun calcolo automatico del
calendario nell'MVP.

## OQ-09

**Retention.** Per quanto conservare bozze, revisioni, audit log, pubblicazioni, richieste di accesso
e dati di utenti rimossi? Necessario prima della produzione, non per l'avvio dello sviluppo.

## OQ-10

**Account e titolarità** di Vercel, Supabase hosted, Resend, dominio e mittente email. Necessario
prima del primo deploy Preview con servizi hosted.

## OQ-11

**Decisa (2026-10-25).** Il bollettino campione contiene dati personali reali e il repository è
pubblico: i file non vengono versionati (`.gitignore`), vanno conservati in `docs/reference-private/`
e le specifiche ne descrivono solo la struttura. La decisione OQ-04 riguarda la pubblicazione da parte
dell'ente tramite Communio e non cambia questa regola sul repository.

## OQ-12

**Decisa (2026-10-25).** Il prodotto si chiama **Communio**. Il repository, inizialmente `voxuna`, è stato rinominato `matteopelucco/communio` dal proprietario (rilevato il 2026-10-26); GitHub reindirizza il vecchio URL.

## OQ-13

**Stato "in revisione" obbligatorio o facoltativo.** Nasce da OQ-02.

**Decisa il 2026-10-26 dal product owner: opzione A.** La revisione **non è obbligatoria** prima della
pubblicazione: chi ha il permesso di pubblicare (secondo la politica `restricted`/`open`, OQ-02) può
pubblicare direttamente dalla bozza. Lo stato `in_review` resta disponibile come passaggio facoltativo,
per esempio per chi non ha il permesso di pubblicare con la politica `restricted`. Dettagli delle
transizioni in F-005.

Opzioni valutate:

| Opzione | Conseguenze |
| --- | --- |
| A. Facoltativo: chi può pubblicare può farlo direttamente da bozza. | Flusso rapido; la revisione è una scelta del redattore. |
| B. Obbligatorio con politica `restricted`: chi non può pubblicare invia in revisione. | Coerente con la politica riservata; in `open` lo stato diventa superfluo. |
| C. Impostazione separata dell'organizzazione. | Massima flessibilità, più combinazioni da testare. |

Raccomandazione originale (non adottata): B.

## OQ-14

**Identificativo di accesso.** Nasce da OQ-03 ("username e password").

**Decisa il 2026-10-26 dal product owner: opzione A.** L'email è lo username. Si usa l'autenticazione
email + password nativa di Supabase Auth; il recupero della password avviene via email. Nessuna
colonna `username` separata.

| Opzione | Conseguenze |
| --- | --- |
| A. L'email è lo username. | Supporto nativo di Supabase Auth; recupero password via email semplice. |
| B. Username distinto dall'email, che resta obbligatoria. | Serve uno strato di mappatura username → account; unicità e validazione dello username; recupero password via email. |
| C. Username senza email. | Recupero dell'accesso solo tramite un amministratore; sconsigliato. |

**Raccomandazione:** A, salvo esigenze specifiche (es. account condivisi di segreteria).

## OQ-15

**Richiesta di accesso.** Nasce da OQ-03.

**Decisa il 2026-10-26 dal product owner, "per ora":** le richieste di accesso sono approvate
dall'**amministratore generale**, cioè il gestore del servizio (`service_admin`). Vale per tutte le
richieste, comprese quelle che riguardano organizzazioni già esistenti. "Per ora" indica una scelta
valida per l'MVP: in futuro l'approvazione potrà essere delegata a `owner`/`admin` delle organizzazioni.

Le domande 2–5 non hanno ricevuto risposta esplicita. In F-002 si propongono le soluzioni seguenti, da
confermare con l'approvazione della spec:

| Domanda | Proposta |
| --- | --- |
| 2. Richiesta per un'organizzazione nuova | Ammessa: il gestore del servizio crea l'organizzazione e assegna il richiedente come `owner`. |
| 3. Dati raccolti | Nome, email, organizzazione/parrocchia (esistente o nuova), ruolo richiesto, messaggio. |
| 4. Creazione dell'account | Email con link monouso e a scadenza per impostare la password. |
| 5. Inviti diretti | Mantenuti per il gestore del servizio; per `owner`/`admin` da decidere in F-002. |

Domande originali:

1. Chi riceve e approva la richiesta: `owner`/`admin` dell'organizzazione indicata, il gestore del servizio o entrambi?
2. Si può chiedere l'accesso anche per un'**organizzazione nuova** (una parrocchia non ancora presente)?
3. Quali dati raccoglie il form (proposta: nome, email, organizzazione/parrocchia, ruolo richiesto, messaggio)?
4. Dopo l'approvazione, come nasce l'account (proposta: email con link monouso per impostare la password)?
5. Oltre al form, gli amministratori possono **invitare** direttamente nuovi membri?

Raccomandazione originale (adottata solo in parte): richieste per organizzazioni esistenti gestite da
`owner`/`admin`; richieste per organizzazioni nuove gestite dal gestore del servizio.

## OQ-16

**Curatela del catalogo condiviso e licenze.**

**Decisa il 2026-10-26 dal product owner:** il catalogo dei canti è curato dall'amministratore.
Interpretazione registrata, coerente con OQ-15: si tratta del gestore del servizio (`service_admin`),
unico autore delle modifiche al catalogo **condiviso**. Il catalogo **locale** delle organizzazioni
previsto dal mandato (§1, §7) resta gestito dalle organizzazioni stesse.

Le domande 2–4 non hanno ricevuto risposta esplicita. In F-011 si propongono le soluzioni seguenti:

| Domanda | Proposta |
| --- | --- |
| 2. Proposte al catalogo condiviso | Fuori dall'MVP: le organizzazioni usano il catalogo locale. |
| 3. Licenze collettive | Campo descrittivo su canto/fonte, senza gestione dedicata nell'MVP. |
| 4. Ruolo dello stato dei diritti | Informativo, registrato quando rilevante; non blocca la pubblicazione (coerente con OQ-05). |

Domande originali:

1. Chi cura il catalogo condiviso: solo il gestore del servizio?
2. Le organizzazioni possono proporre canti al catalogo condiviso?
3. Esistono licenze collettive (es. accordi diocesani) da registrare?
4. Lo stato dei diritti è un campo informativo o limita la pubblicazione del testo?

Raccomandazione originale: curatela del gestore del servizio; proposte dalle organizzazioni con
approvazione; stato dei diritti come informazione, senza bloccare la pubblicazione.
