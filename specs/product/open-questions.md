# Questioni aperte per il product owner

- **Ultimo aggiornamento:** 2026-10-25

Ogni questione indica cosa blocca, le opzioni con conseguenze e una raccomandazione. Le decisioni
prese si registrano qui (stato `Decisa`) e si propagano a specifiche e ADR.

## Riepilogo

| ID | Questione | Blocca | Stato |
| --- | --- | --- | --- |
| [OQ-01](#oq-01) | Corrispondenza tra organizzazione (tenant) e unità pastorale | F-001, data model | **Aperta, bloccante** |
| [OQ-02](#oq-02) | Ruoli e chi può approvare/pubblicare | F-002, F-005 | **Aperta, bloccante** |
| [OQ-03](#oq-03) | Metodo di autenticazione e modalità di accesso | F-002 | **Aperta, bloccante** |
| [OQ-04](#oq-04) | Pubblicazione di intenzioni e recapiti personali | F-006, F-010 | **Aperta, bloccante per la pubblicazione** |
| [OQ-05](#oq-05) | Testi dei canti: memorizzazione, pubblicazione, curatela del catalogo condiviso | F-011 | **Aperta, bloccante per i canti** |
| [OQ-06](#oq-06) | Visibilità dell'archivio pubblico e schema degli URL | F-010 | Aperta, non bloccante ora |
| [OQ-07](#oq-07) | Regola di numerazione delle edizioni | F-005 | Aperta, non bloccante ora |
| [OQ-08](#oq-08) | Riti da supportare nell'MVP | F-006 | Aperta, non bloccante ora |
| [OQ-09](#oq-09) | Conservazione e cancellazione dei dati (retention) | Produzione | Aperta, prima del go-live |
| [OQ-10](#oq-10) | Dominio, account Vercel/Supabase/Resend e titolarità | Preview/Production | Aperta, prima del primo deploy |
| [OQ-11](#oq-11) | Materiale di riferimento con dati personali | Repository | **Decisa** (2026-10-25) |
| [OQ-12](#oq-12) | Nome del prodotto | Documentazione | **Decisa** (2026-10-25) |

---

## OQ-01

**Corrispondenza tra organizzazione (tenant) e unità pastorale.**

Il campione è un bollettino unico per un'unità pastorale di tre parrocchie.

| Opzione | Conseguenze |
| --- | --- |
| A. **Organizzazione = unità pastorale** (o parrocchia singola); le edizioni appartengono all'organizzazione. | Modello più semplice; RLS su `organization_id`. Una diocesi con più unità pastorali = più tenant. |
| B. Organizzazione = ente sovraordinato (es. decanato/diocesi) con più unità pastorali, ognuna con le proprie edizioni. | Serve un livello in più (`pastoral_units`) e permessi per unità; RLS più complessa. |
| C. Come A, ma una parrocchia può pubblicare anche un bollettino proprio separato. | Serve un "ambito" dell'edizione (organizzazione o singola parrocchia). |

**Raccomandazione:** A per l'MVP, con `parish_memberships` solo se emerge l'esigenza di permessi per
singola parrocchia. B è un'estensione futura con migrazione.

## OQ-02

**Ruoli e chi può approvare/pubblicare.** Il mandato prevede il ciclo bozza → revisione →
pubblicazione → archiviazione, ma non dice chi approva.

Proposta di ruoli per organizzazione:

| Ruolo | Può |
| --- | --- |
| `owner` | Tutto, inclusa la gestione dei membri e la cancellazione dell'organizzazione. |
| `admin` | Gestire parrocchie, luoghi, membri (tranne owner), pubblicare. |
| `editor` | Creare/modificare bozze, inviare in revisione. Pubblicare: **da decidere**. |
| `viewer` | Leggere bozze e pubblicazioni interne. |

Domande:

1. Un `editor` può pubblicare direttamente o serve sempre un `admin`/`owner`?
2. Lo stato "in revisione" è obbligatorio o facoltativo per organizzazione?
3. Servono permessi limitati alla singola parrocchia nell'MVP?

**Raccomandazione:** pubblicazione riservata a `admin`/`owner`; revisione facoltativa (configurabile
in futuro); nessun permesso per parrocchia nell'MVP.

## OQ-03

**Metodo di autenticazione e modalità di accesso.**

| Opzione | Conseguenze |
| --- | --- |
| A. Magic link via email (Supabase Auth). | Nessuna password da gestire; dipende dal recapito email; serve SMTP in hosted. |
| B. Email + password. | Familiare; richiede policy password e reset. |
| C. Entrambi. | Più superficie da testare e mettere in sicurezza. |

E inoltre: registrazione **solo su invito** (consigliato) o anche self-service con creazione di una
nuova organizzazione?

**Raccomandazione:** A + B (password facoltativa) **oppure** solo B per semplicità di supporto agli
utenti non tecnici; accesso **solo su invito**, creazione organizzazioni riservata al gestore del
servizio nell'MVP. Login social escluso dall'MVP.

## OQ-04

**Pubblicazione di intenzioni e recapiti personali.** Il campione pubblica nomi di defunti nelle
intenzioni e numeri di telefono personali. In una pagina web pubblica e indicizzabile l'esposizione
è molto maggiore rispetto alla stampa distribuita in chiesa.

| Opzione | Conseguenze |
| --- | --- |
| A. Intenzioni pubblicate in HTML e PDF come nel campione. | Massima continuità; maggiore esposizione; serve base giuridica/consenso gestito dalla parrocchia. |
| B. Intenzioni nel PDF ma omesse o abbreviate nell'HTML pubblico; pagina con `noindex`. | Compromesso; HTML e PDF divergono in modo controllato e dichiarato. |
| C. Scelta per organizzazione/edizione, con default prudente (B). | Flessibile; più casi da testare. |

**Raccomandazione:** C con default B, avviso al redattore sui dati personali e `noindex` sulle pagine
pubbliche finché non diversamente deciso. Serve parere privacy dell'ente (non è una decisione tecnica).

## OQ-05

**Testi dei canti.** Molti canti liturgici sono protetti da diritto d'autore.

Domande:

1. Il catalogo può memorizzare testi completi? Solo per canti con diritti verificati?
2. L'edizione può riportare il testo (come nel campione) o solo titolo/riferimento al libretto?
3. Chi cura il catalogo condiviso: solo il gestore del servizio? Le organizzazioni possono proporre canti?
4. Esistono licenze collettive (es. accordi diocesani) da registrare?

**Raccomandazione:** campo `rights_status` obbligatorio; testo pubblicabile solo se `public_domain` o
`licensed`; altrimenti solo titolo e riferimento. Catalogo condiviso curato solo dal gestore.

## OQ-06

**Archivio pubblico e URL.** Proposta: `/{org-slug}/edizioni/{anno}/{numero}`, con archivio elencato
pubblicamente per organizzazione; opzione "non in elenco" (slug non prevedibile) rinviata. Le
pagine non sono una forma di autorizzazione. Da confermare: archivio pubblico per default?

## OQ-07

**Numerazione delle edizioni.** "Anno XII – N. 6": l'anno è progressivo dalla fondazione del
bollettino; il numero si azzera a inizio anno solare, a inizio anno pastorale (settembre) o in altro
modo? Proposta: numero e anno modificabili, con suggerimento automatico dal precedente.

## OQ-08

**Riti da supportare.** Il campione è ambrosiano. Proposta: impostazione `rite` per parrocchia con
`ambrosian` e `roman`; i momenti liturgici proposti dipendono dal rito; nessun calcolo automatico del
calendario nell'MVP.

## OQ-09

**Retention.** Per quanto conservare bozze, revisioni, audit log, pubblicazioni e dati di utenti
rimossi? Necessario prima della produzione, non per l'avvio dello sviluppo.

## OQ-10

**Account e titolarità** di Vercel, Supabase hosted, Resend, dominio e mittente email. Necessario
prima del primo deploy Preview con servizi hosted.

## OQ-11

**Decisa (2026-10-25).** Il bollettino campione contiene dati personali reali e il repository è
pubblico: i file non vengono versionati (`.gitignore`), vanno conservati in `docs/reference-private/`
e le specifiche ne descrivono solo la struttura.

## OQ-12

**Decisa (2026-10-25).** Il prodotto si chiama **Communio**; `voxuna` è il nome del repository.
