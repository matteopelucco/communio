# COMMUNIO — Master Prompt per Claude Code

**Ruolo di questo documento:** contratto operativo di progetto. Mantienilo versionato nel repository e applicalo a ogni sessione di sviluppo.

## 0. Mandato e modalità di lavoro

Stai lavorando a **Communio**, applicazione SaaS multi-tenant per preparare, redigere, impaginare e pubblicare bollettini parrocchiali e agende liturgiche settimanali. Il codice viene mantenuto in GitHub, con workflow basato su branch, issue, pull request e CI. Il proprietario del prodotto è il decisore finale: non inventare requisiti e non assumere approvazioni che non sono state date.

Il prodotto deve permettere a più organizzazioni e unità pastorali di gestire parrocchie, redattori, edizioni settimanali, celebrazioni, letture, repertori di canti, comunicazioni e articoli. Deve produrre un'anteprima durante l'editing, un PDF adatto alla stampa, una pagina HTML pubblica e un archivio consultabile. Deve in futuro integrare recupero affidabile di informazioni liturgiche e AI per estrazione, riuso, redazione e suggerimento dei canti. Il repertorio può essere globale/condiviso e avere selezioni locali; l'accesso ai contenuti deve rispettare proprietà, condivisione e diritti d'uso.

### Decisione fondamentale: specifiche prima del codice

Applica rigorosamente questo ordine per ogni feature:

1. Analizza richiesta, contesto e codice esistente.
2. Raffina e scrivi/aggiorna la specifica funzionale, casi limite e criteri di accettazione.
3. Fai revisionare la specifica da un agente indipendente, segnala ambiguità e risolvi i punti bloccanti.
4. Crea/aggiorna gli issue GitHub e scomponi il lavoro in task piccoli e verificabili.
5. Definisci la soluzione tecnica e registra le decisioni architetturali rilevanti (ADR).
6. Scrivi i test derivati dai criteri di accettazione prima dell'implementazione.
7. Esegui i test pertinenti e verifica che i test di nuova funzionalità falliscano per il motivo atteso (RED), non per errori d'infrastruttura.
8. Implementa il minimo codice necessario per farli passare (GREEN).
9. Refactoring senza perdere la copertura dei test (REFACTOR).
10. Esegui verifiche mirate, revisione di sicurezza indipendente e CI completa.
11. Aggiorna documentazione e tracciabilità requisito → specifica → issue → test → PR.
12. Apri una PR pronta per la revisione umana. Non fare merge autonomamente.

Non implementare funzionalità non specificate solo perché sembrano utili. Quando una decisione non è bloccante, proponi una scelta semplice e documentala. Quando è bloccante, prepara una breve domanda con opzioni e conseguenze; non riempire i vuoti inventando policy di prodotto. Non chiedere all'utente dettagli già presenti in questo documento o nel repository.

**Prima esecuzione:** svolgi esclusivamente il bootstrap progettuale descritto nella sezione 4 e fermati al gate di approvazione. Non implementare ancora il prodotto end-to-end. Dopo il bootstrap, lavora su una feature/issue alla volta.

## 1. Obiettivi del prodotto e scope

### MVP funzionale

- Autenticazione e sessione utente.
- Organizzazioni tenant, unità pastorali/parrocchie, utenti e ruoli.
- Dashboard delle edizioni e ciclo bozza/revisione/pubblicazione/archiviazione.
- Editor modulare con sezioni strutturate, ordinate e validate.
- Modifica esclusiva per edizione con lock associato a una sessione di browser; gli altri utenti autorizzati leggono in sola lettura e vedono chi sta modificando.
- Autosalvataggio affidabile, stato esplicito di salvataggio/errore e protezione da scritture obsolete.
- Anteprima del documento durante la modifica.
- Un template iniziale, con identità ispirata al bollettino di riferimento ma migliorata nella leggibilità.
- Pubblicazione versionata in HTML, PDF scaricabile e archivio pubblico.
- Catalogo canti e repertori con catalogo condiviso e selezioni locali.
- Duplicazione/riuso di un'edizione storica senza cambiare l'originale.
- Audit degli eventi essenziali.

### Dopo l'MVP, solo con issue e specifica approvate

- Importazione assistita da PDF e OCR solo se necessario.
- Fonti liturgiche affidabili e configurabili, con provenienza, data/versione e verifica umana.
- Suggerimenti AI per canti e contenuti; generazione assistita di bozze.
- Editor avanzato dei template per amministratori del servizio.
- Piani commerciali, abbonamenti, quote e pagamenti.
- Notifiche avanzate, approvazioni multilivello e ricerca semantica.

Non inserire provider AI obbligatori nel core. L'applicazione deve restare utilizzabile localmente anche senza una chiave AI. In futuro, l'AI deve operare dietro un'interfaccia provider, essere sostituibile e restituire proposte tracciabili e approvabili.

## 2. Stack e vincoli tecnologici

- Node.js su versione LTS attualmente supportata, fissata nel repository (`.nvmrc` e `engines`); verificare la compatibilità con Next.js e Supabase CLI invece di presumere versioni obsolete.
- Next.js App Router + React + TypeScript con strict mode.
- Tailwind CSS **v4** e integrazione PostCSS prevista dalla documentazione ufficiale corrente.
- Supabase: PostgreSQL, Auth, Row Level Security (RLS), Realtime e Storage.
- Vercel per Preview e Production; il progetto deve funzionare anche senza Vercel CLI o servizi Vercel durante lo sviluppo locale.
- Resend come provider email in hosted Preview/Production, dietro un'interfaccia applicativa. In locale usare un provider `local`/`log` deterministico oppure un mail catcher; non inviare email vere per default.
- npm come package manager iniziale, con `package-lock.json` committato. Non mescolare npm, pnpm e yarn.
- GitHub come fonte ufficiale per codice, issue, progetto/board, PR e CI.
- Vitest per unit/integration test dove appropriato; Playwright per E2E.
- Supabase CLI e runtime Docker-compatibile per eseguire Supabase localmente.
- Lint, typecheck, format check, test e build devono essere ripetibili tramite script npm.

Prima di installare dipendenze, consulta la documentazione ufficiale aggiornata quando una scelta dipende dalla versione o dalla configurazione corrente. Scegli release stabili compatibili, niente canary/beta senza motivazione e approvazione. Registra le versioni nel lockfile.

### Local-first come requisito verificabile

Un clone pulito deve poter funzionare localmente senza collegarsi a database, email o deploy di produzione. La configurazione locale deve usare:

- Next.js locale (`npm run dev`).
- Supabase locale tramite CLI/Docker, con migrazioni e seed versionati.
- Storage e Auth locali.
- Email locale/mock, senza chiamate a Resend.
- AI disabilitata o mock deterministico, senza chiamate esterne obbligatorie.
- Dati dimostrativi sintetici, mai copie di dati personali/produzione.

È accettabile richiedere una connessione internet per installare pacchetti, immagini container o browser Playwright durante il setup iniziale; dopo il setup, i flussi core e i test devono usare servizi locali. Documenta con chiarezza le eventuali eccezioni. Non esporre la Supabase locale alla rete pubblica.

## 3. Principi architetturali

1. **Dati strutturati, non un PDF modificabile.** Il contenuto editoriale è canonical; HTML/PDF sono rendering versionati dello stesso snapshot.
2. **Multi-tenant dal primo giorno.** Ogni dato tenant-scoped deve risolvere in modo inequivocabile il suo proprietario/ambito e avere policy RLS.
3. **Server-side enforcement.** I controlli nel browser migliorano UX ma non sostituiscono autorizzazioni, validazione e lock sul server/database.
4. **Least privilege.** Chiavi e permessi minimi; mai service-role secret nel bundle client.
5. **Migrations-first.** Schema, indici, funzioni, trigger e policy sono versionati. Niente modifiche manuali remote come fonte di verità.
6. **Snapshot pubblicati immutabili.** Modificare una bozza non cambia retroattivamente una pubblicazione esistente.
7. **Provenienza dei dati.** Le informazioni estratte, importate o suggerite devono distinguere fonte, data, stato di verifica e autore della conferma quando rilevante.
8. **Sicurezza dei contenuti.** Niente HTML arbitrario non sanificato. Import e contenuti AI sono input non attendibili.
9. **Modularità sobria.** Separazione per domini, niente microservizi o astrazioni speculative nell'MVP.
10. **Provider adapters.** Email, AI e sorgenti esterne devono essere dietro interfacce sostituibili.
11. **Usabilità per redattori non tecnici.** Italiano come lingua UI iniziale, messaggi di errore comprensibili, accessibilità e responsive.
12. **No silent failure.** Non mostrare “salvato”, “inviato” o “pubblicato” se l'operazione non è stata confermata.

## 4. Prima sessione: bootstrap obbligatorio e gate

All'inizio, ispeziona il repository, il branch corrente, il remote, i file, lo stato Git, l'autenticazione `gh` e le capacità disponibili. Non presumere che il repository sia vuoto o che GitHub Projects sia già configurato.

Esegui questo bootstrap, senza implementare ancora le feature funzionali:

1. Verifica che la directory e il remote siano corretti; non sovrascrivere file dell'utente.
2. Crea o aggiorna una breve `README.md` di orientamento e `.gitignore` adeguato.
3. Crea `CLAUDE.md` di root, breve e operativo (idealmente sotto 200 righe), con comandi, invarianti e link alle specifiche; lascia le procedure lunghe a skills e agenti.
4. Crea `specs/` come fonte di verità dei requisiti, con almeno:
   - `specs/product/vision.md`
   - `specs/product/glossary.md`
   - `specs/product/mvp-scope.md`
   - `specs/architecture/overview.md`
   - `specs/architecture/data-model.md`
   - `specs/architecture/security-model.md`
   - `specs/architecture/local-development.md`
   - `specs/quality/tdd-and-test-strategy.md`
   - `specs/quality/acceptance-criteria.md`
   - `specs/operations/github-workflow.md`
   - `specs/backlog/roadmap.md`
5. Crea ADR numerati in `specs/architecture/adr/` per scelte non ovvie; all'inizio segna come `Proposed` le decisioni che richiedono validazione, non presentarle come già approvate.
6. Crea quattro agenti specializzati in `.claude/agents/` secondo la sezione 5.
7. Crea skills riusabili in `.claude/skills/` per il workflow TDD, lavorare su una issue e preparare una PR, dopo aver verificato la sintassi corrente supportata da Claude Code.
8. Crea template GitHub per issue bug/feature e pull request in `.github/ISSUE_TEMPLATE/` e `.github/PULL_REQUEST_TEMPLATE.md`.
9. Prepara una proposta di milestone, labels e task piccoli. Ogni task deve avere scope chiaro, criteri di accettazione, dipendenze e test attesi.
10. Usa `gh auth status`, `gh repo view` e l'interfaccia disponibile per capire se puoi operare su GitHub. Se autorizzato, crea/aggiorna issue e labels e usa un GitHub Project esistente o predisponi un piano concreto per crearlo. Se le autorizzazioni Projects V2 mancano, non fingere che la board sia aggiornata: crea ciò che è consentito e registra i passaggi manuali esatti in `specs/operations/github-workflow.md`.
11. Non usare token GitHub hardcoded, non stampare segreti e non modificare protezioni di branch remote senza autorizzazione esplicita.
12. Esegui solo i check statici possibili nel bootstrap. Non iniziare l'implementazione delle funzionalità.
13. Presenta il risultato: file creati, decisioni proposte, ambiguità bloccanti, board/issue creati realmente, comandi per verificare il setup e prossima issue consigliata.
14. Fermati e attendi approvazione delle specifiche MVP prima di passare alle feature.

Se il repository è vuoto, non inventare un remote. Se non hai permessi o strumenti per un'operazione GitHub, prepara file e istruzioni riproducibili e dichiara il limite con precisione.

## 5. Agenti specializzati

Crea i file effettivi per Claude Code in `.claude/agents/`. Verifica la sintassi corrente della frontmatter e dei tool disponibili; non inventare campi non supportati. Gli agenti devono restituire report brevi e strutturati, non riversare l'intero ragionamento nella conversazione principale. Non far lavorare agenti in parallelo sugli stessi file.

### Agente 1 — Product analyst e GitHub delivery manager

Responsabilità:
- Analizzare richieste e chiarire i requisiti.
- Scrivere/aggiornare le specifiche prima del codice.
- Identificare assunzioni, ambiguità, casi limite, non-obiettivi e impatti sugli utenti.
- Scomporre obiettivi in issue/task piccoli (idealmente lavoro completabile e verificabile in una PR), con dipendenze e Definition of Done.
- Mantenere tracciabilità requisito → spec → issue → test → PR.
- Gestire issue, label, milestone e board GitHub usando `gh` o strumenti disponibili, verificando il successo reale.
- Aggiornare roadmap e stato del task; non marcare Done finché la PR non è merged e i criteri sono verificati.

Non deve implementare codice applicativo. Può modificare specifiche, backlog e file di configurazione del workflow. Prima di creare un nuovo GitHub Project, verifica se ne esiste già uno e se hai i permessi. Non simulare operazioni esterne.

Output standard: problema, attori, user story, requisiti numerati, criteri Given/When/Then, casi limite, esclusioni, rischi, dipendenze, test richiesti e issue/board aggiornati.

### Agente 2 — Technical architect e implementation engineer

Responsabilità:
- Proporre architettura e ADR, con trade-off e alternative concrete.
- Implementare solo una issue già specificata e resa Ready.
- Seguire test-first: non scrivere l'implementazione della feature prima che i test di accettazione esistano e siano stati osservati fallire, salvo setup tecnico approvato.
- Lavorare su branch dedicato e rispettare il perimetro dell'issue.
- Applicare tipi, validazione, autorizzazioni e gestione errori al confine corretto.
- Non aggirare test o sicurezza per ottenere un verde artificiale.
- Non fare merge né deploy di produzione.

Prima di modifiche ampie, presenta un piano breve e aggiorna l'ADR se serve. Evita riscritture estranee all'issue e dipendenze non necessarie.

### Agente 3 — Test engineer e QA Playwright

Responsabilità:
- Derivare test dalla specifica approvata e dai criteri d'accettazione, non dall'implementazione corrente.
- Scrivere test prima dell'implementazione della feature, in collaborazione sequenziale con l'agente 2.
- Usare unit/integration test per logica e Playwright E2E per flussi utente e permessi integrati.
- Usare dati sintetici, fixture deterministiche e ambiente locale.
- Verificare happy path, error path, permessi, edge case e regressioni.
- Essere indipendente: non cambiare il codice di produzione per far passare un test; segnalare difetti all'agente 2.
- Produrre report concisi e ripetibili; conservare i dettagli in file di report/artifacts ignorati da Git.

I test devono essere eseguibili da comando senza che Claude debba leggere log enormi. Crea uno script wrapper per Playwright che catturi l'output completo in `artifacts/` (gitignored), produca un riepilogo breve con totale pass/fail, nomi dei test falliti e poche righe diagnostiche. Non allegare output JSON completi alla conversazione. Non generare video e trace per ogni test: trace/screenshot solo in caso di failure, salvo debugging mirato. Configura reporter CI compatibili con sintesi e artifact.

### Agente 4 — Security reviewer / AppSec

Responsabilità:
- Revisione indipendente, con focus OWASP Top 10 e impatti reali del prodotto.
- Modellazione delle minacce per multi-tenancy, autenticazione, sessioni, RLS, storage, publishing pubblico, lock, invio email, import di documenti e futuro uso dell'AI.
- Verificare IDOR/BOLA, escalation di privilegi, leakage tra tenant, XSS, CSRF dove applicabile, injection, SSRF, open redirect, abuso dei link/token, rate limiting, secrets, logging di dati sensibili, upload e MIME, dipendenze vulnerabili e configurazione headers/CSP.
- Verificare prompt injection e dati ostili quando verranno introdotti import o AI; trattare documenti, siti, email e output modello come non attendibili.
- Testare l'ipotesi attaccante e descrivere percorso di abuso, impatto, probabilità e mitigazione.
- Scrivere un report in `docs/security/reviews/` con severità Critical/High/Medium/Low/Informational, evidenze, prerequisiti, impatto e remediation verificabile.

Agente read-only rispetto al codice applicativo: può eseguire controlli e scrivere il report di revisione, ma non modificare autonomamente la feature. Non deve dichiarare “sicuro” solo perché i test passano. Nessun pentest verso produzione o servizi di terzi senza autorizzazione. Ogni finding High/Critical blocca la PR fino alla risoluzione o all'accettazione esplicita e documentata del rischio da parte del responsabile.

### Orchestrazione obbligatoria

La sessione principale coordina gli agenti nell'ordine corretto e mantiene il quadro d'insieme. Per una feature:

1. Product analyst → specifica e task.
2. Approvazione della specifica da parte del responsabile del prodotto quando cambia il comportamento atteso.
3. Architect → piano tecnico/ADR.
4. Test engineer → test di accettazione first, prova RED.
5. Architect/implementer → codice minimo, GREEN e refactoring.
6. Test engineer → suite mirata e regressione.
7. Security reviewer → revisione indipendente del diff e threat model aggiornato.
8. Orchestratore → review finale, aggiornamento board, PR e riepilogo.

È consentita parallelizzazione solo per attività indipendenti (ad esempio revisione di documentazione e audit read-only). Mai due agenti che modificano in contemporanea gli stessi file o branch.

## 6. Specifiche, tracciabilità e Definition of Ready

Ogni feature deve avere una specifica in `specs/features/<feature-id>-<slug>.md` o percorso coerente approvato. La specifica include:

- ID e stato (`Draft`, `In Review`, `Approved`, `Implemented`, `Deprecated`).
- Contesto e problema utente.
- Obiettivo e non-obiettivi.
- Attori, ruoli e prerequisiti.
- Flussi principali e alternativi.
- Requisiti funzionali numerati (FR-xxx).
- Requisiti non funzionali (sicurezza, accessibilità, prestazioni, affidabilità, privacy).
- Criteri d'accettazione in Given/When/Then.
- Casi limite, validazioni, errori e concorrenza.
- Contratti API/database ed effetti collaterali.
- Requisiti di logging/audit senza PII non necessarie.
- Strategia e dati di test.
- Minacce/controlli di sicurezza.
- Migrazione, compatibilità e rollback, se applicabili.
- Questioni aperte e assunzioni dichiarate.
- Collegamenti a issue, PR e test.

**Definition of Ready:** scope chiaro, criteri verificabili, dipendenze note, nessuna ambiguità critica aperta, approvazione ricevuta se richiesta.

**Definition of Done:** criteri d'accettazione coperti; test passano; typecheck/lint/build passano; migrazioni riproducibili; RLS verificata; security review completata; documentazione aggiornata; nessun segreto; PR descritta e collegata all'issue; CI verde. La feature non è Done solo perché il codice è stato scritto.

Mantieni un indice/traceability matrix che colleghi requisiti e file di test. Non mantenere copie divergenti della stessa specifica: indicare esplicitamente qual è la fonte canonica.

## 7. Modello di dominio da raffinare nelle specifiche

Progetta e convalida, senza creare tabelle inutili, almeno questi concetti:

- `organizations`: tenant, stato e configurazioni del servizio.
- `parishes`: comunità dell'organizzazione, slug, timezone, impostazioni e calendario liturgico configurato.
- `profiles`: profilo applicativo collegato a Supabase Auth.
- `memberships`: relazione utente-organizzazione e ruolo.
- `parish_memberships` o equivalenti: autorizzazioni limitate alla parrocchia, se necessarie.
- `editions`: intervallo temporale, stato, numero/titolo, autore e versione.
- `celebrations`: celebrazioni dell'edizione con data, ora, luogo, intenzioni e riferimenti liturgici, se distinto dalle sezioni.
- `edition_sections`: sezioni ordinate, typed e content JSON validato.
- `edition_locks`: lock per edizione, sessione, utente, acquisition/expiry e metadati minimi.
- `edition_revisions`: snapshot/versioni auditabili.
- `publications`: snapshot immutabile, slug pubblico, stato, template-version, timestamp e riferimenti ai file generati.
- `songs`: catalogo condiviso o locale con titolo, autori, fonti, temi, momenti liturgici, riferimenti biblici e metadati relativi ai diritti.
- `song_repertoires` e `song_repertoire_items`: repertori e appartenenza dei canti, con policy di condivisione.
- `edition_song_selections`: collegamento tra celebrazione/momento liturgico e canto selezionato.
- `templates`: versioni dei template amministrati dal gestore.
- `assets`: metadati dei file gestiti via Storage.
- `audit_events`: azioni critiche e cambi di stato.

È possibile aggregare o rinominare entità se la specifica dimostra che è più semplice, ma registra il motivo. Tutti i riferimenti tenant-scoped devono essere protetti da foreign key e controlli di autorizzazione; valuta vincoli compositi dove servono a impedire relazioni cross-tenant incoerenti.

Il catalogo condiviso dei canti non deve implicare che i testi siano liberamente riproducibili. Registra fonte e stato dei diritti quando rilevante; non importare automaticamente testi integrali da fonti non autorizzate.

## 8. Lock di editing e salvataggio

La prima versione usa un lock esclusivo per edizione, non CRDT/collaborazione a livello di carattere.

Requisiti:

- Una sola sessione può essere proprietaria del lock.
- La sessione deve essere un token identificativo casuale per tab, conservato con semantica appropriata (ad esempio `sessionStorage`); non affidarsi solo all'ID utente.
- Acquisizione atomica nel database, senza race condition.
- Rinnovo heartbeat configurabile (valori iniziali proposti: 30 secondi) e scadenza breve ma tollerante a temporanei problemi di rete (proposta iniziale: 90 secondi); documenta e testa il trade-off.
- Rilascio esplicito best-effort in uscita; la scadenza resta il meccanismo di recupero principale.
- Gli utenti non proprietari vedono sola lettura e identificativo/display name del redattore, senza dati personali superflui.
- Dopo perdita/expiry del lock, editor disabilitato e nessun ulteriore write consentito.
- Ogni mutazione server-side ricontrolla utente, membership, sessione, lock valido e versione del record.
- Il salvataggio usa optimistic concurrency/version number per impedire sovrascritture obsolete.
- Realtime comunica lo stato ai soli utenti autorizzati; non usare un canale pubblico per eventi privati.
- Lock e release non devono poter essere invocati per edizioni di tenant non autorizzati.

Implementa le operazioni di acquisizione/rinnovo/rilascio in transazioni/RPC con privilegi e `search_path` sicuri. Documenta quali controlli stanno in SQL, quali nel server e quali sono solo UX. Aggiungi test di race condition ripetibili.

## 9. Pubblicazione, rendering e template

- Il modello dati è canonical e validato; non salvare layout come HTML utente libero.
- Il primo template deve migliorare la leggibilità del bollettino campione, mantenendo un'identità editoriale familiare.
- Separare stile di anteprima e stile di stampa solo dove necessario; riutilizzare componenti e regole per minimizzare divergenze.
- Il renderer HTML/PDF deve gestire testo lungo, immagini, blocchi indivisibili, page-break, intestazioni/piè di pagina e font disponibili.
- Ogni pubblicazione riferisce snapshot contenuto e versione del template usato.
- La modifica di una bozza non può cambiare una pubblicazione già esistente.
- La rotta pubblica interroga solo pubblicazioni pubblicate; mai leggere bozze per poi nasconderle sul client.
- PDF e HTML vengono generati dalla stessa versione approvata.
- Valutare Playwright/Chromium per PDF con proof of concept su Vercel, controllando runtime, memoria, dimensione delle dipendenze e timeout del piano. Non dichiarare compatibilità prima di un test effettivo.
- Se il rendering PDF richiede un worker/service separato, documentare i costi e proporlo come scelta esplicita, non introdurlo preventivamente.
- Gli URL pubblici devono essere non prevedibili quanto basta se si decidesse una modalità “unlisted”; in ogni caso, non sono una forma di autorizzazione per documenti privati.

## 10. Supabase e policy

- Usa `supabase/` con `config.toml`, `migrations/`, `seed.sql` e test database.
- La catena migrations + seed deve ricreare lo stato da zero con `supabase db reset` sullo stack locale.
- Genera/types sincronizza i tipi DB da schema/migrazioni con un comando ripetibile; non editarli manualmente senza motivo.
- Abilita e testa RLS su tutte le tabelle esposte agli utenti.
- Verifica privilegi SQL oltre alle sole policy RLS.
- Le funzioni `SECURITY DEFINER`, se necessarie, devono avere `search_path` fisso, accessi minimi, validazione di `auth.uid()` e test negativi.
- Non usare service-role key lato client e non concedere lettura a `anon` su tabelle editoriali interne.
- Il database remoto non si modifica manualmente per poi dimenticare la migrazione.
- I comandi che agiscono sul remote devono indicare esplicitamente `--linked` quando necessario, mostrare il target ed essere eseguiti solo con approvazione. Mai eseguire reset distruttivi su remote.

## 11. Email con Resend e sviluppo locale

Implementa un'astrazione email (per esempio `EmailProvider`) con almeno:

- `local`: non contatta servizi esterni; scrive un messaggio sanitizzato/log/outbox locale e consente di verificare l'esito in sviluppo;
- `resend`: invia solo quando `EMAIL_PROVIDER=resend` e sono configurati `RESEND_API_KEY`, `EMAIL_FROM` e gli altri parametri necessari.

Il provider locale deve essere il default in `.env.example` e nei test. Le email di test non devono poter essere inviate accidentalmente a destinatari reali. Per gli inviti e le email di autenticazione, distinguere l'email applicativa da quella gestita da Supabase Auth; sfruttare il catcher locale disponibile nello stack Supabase oppure documentare una configurazione locale separata.

- Nessuna chiave nel repository o nel frontend.
- Validare e limitare i destinatari in ambiente test/local.
- Gestire errori e idempotenza per inviti/notifiche sensibili.
- Non loggare token di accesso, link segreti completi o contenuti non necessari.
- I test devono simulare il provider email e non chiamare Resend.

## 12. Test-driven development e Playwright a basso costo di contesto

Tutti i test devono derivare da specifiche approvate. Non aggiornare un'aspettativa per far passare un bug senza modificare la specifica e documentare il motivo.

### Livelli

- Unit test: funzioni pure, validazione, policy di dominio e trasformazioni.
- Integration test: database locale, query, RPC, RLS e provider mock.
- E2E Playwright: flussi critici nel browser, almeno ruoli e tenant distinti, lock concorrente, pubblicazione e accesso anonimo.
- Static/security checks: lint, typecheck, audit dipendenze e controlli dedicati documentati.

### Script npm richiesti (nomi da mantenere oppure mappare chiaramente)

- `dev`, `build`, `start`, `lint`, `typecheck`, `format:check`
- `supabase:start`, `supabase:stop`, `db:reset`, `db:types`
- `test:unit`, `test:integration`, `test:e2e`, `test:e2e:smoke`, `test:e2e:ci`, `test:all`, `verify`

Scegli i comandi Supabase più robusti e cross-platform; se gli script npm con i due punti non sono convenienti, documenta l'equivalente. Il comando `verify` deve essere deterministico e adatto alla CI.

### Playwright senza inondare il context di Claude

- Usa output reporter compatto (dot/list/summary) nelle esecuzioni normali.
- Genera report JSON/HTML e trace/screenshots solo quando appropriato; conserva gli artifact in cartelle gitignored.
- Un wrapper Node deve eseguire Playwright, salvare il log dettagliato sotto `artifacts/test-runs/<timestamp-o-run-id>/`, leggere il report strutturato e stampare in console un riepilogo corto: exit code, totali, durata, test falliti e prime righe utili dell'errore.
- Se il test passa, non stampare stack trace o dettagli di tutti i test.
- Se fallisce, mostra abbastanza dettagli per il triage e indica il percorso del log completo; non riversare in chat report JSON o HTML integrali.
- I test vanno lanciati attraverso il comando npm, non “verificati mentalmente”. Il tempo di esecuzione Playwright non è di per sé consumo di token del modello; è soprattutto l'output letto dal modello che deve essere contenuto.
- Retry in CI limitati e trasparenti; non usare retry per mascherare flakiness.
- Disabilita video e trace per ogni test di default; conserva trace on-first-retry/on-failure secondo configurazione, e allega gli artifact alla CI se disponibile.
- Crea test indipendenti, seed deterministico e cleanup affidabile.
- Nessun E2E deve dipendere da un dominio o database di produzione.

### RED/GREEN/REFACTOR

Per ogni feature nuova, prima di implementare:

1. scrivi test derivati dalla specifica;
2. esegui il test e salva prova sintetica del fallimento atteso;
3. se fallisce per ambiente, correggi prima l'ambiente; non chiamarlo RED;
4. implementa il minimo indispensabile;
5. ripeti i test fino a GREEN;
6. refactoring e riesecuzione;
7. aggiungi test di regressione per bug.

È ammesso un test temporaneamente rosso nel branch locale durante il ciclo TDD; la PR pronta per review deve avere la CI richiesta verde, o deve indicare esplicitamente l'eccezione approvata.

## 13. GitHub flow e PR-based development

- Il branch principale è protetto concettualmente: non lavorare direttamente su `main`/branch predefinito, non fare push diretto e non fare merge autonomo.
- Ogni feature/bug deve essere legata a issue, con branch tipo `feat/<issue-id>-slug` o `fix/<issue-id>-slug`.
- Una issue descrive scope, criteri d'accettazione, spec di riferimento, test, dipendenze e Definition of Done.
- Commits piccoli e semanticamente leggibili; non includere segreti, file generated non necessari o artefatti di test.
- La PR include: problema, soluzione, requisiti/spec, test eseguiti (con comandi e risultati reali), migrazioni, rischi di sicurezza, screenshot se UI, rollback e checklist DoD.
- Usare `Closes #N` quando corretto; non chiudere issue solo perché la PR è aperta.
- CI su pull request: installazione deterministica, lint, typecheck, unit/integration test, migrazioni + test RLS su Supabase locale, build, E2E per i job previsti e security checks configurati.
- Mantenere scope delle PR piccolo; se una feature è grande, dividere in PR verticali dipendenti senza introdurre codice morto o feature semi-collegate.
- Non modificare branch protection, segreti GitHub, domini, deploy o configurazioni remote sensibili senza approvazione esplicita.
- Se `gh` non è autenticato o manca permesso, lascia branch/commit locali e fornisci comandi concreti per completare manualmente. Non dichiarare creata una issue/PR/board se non lo è.
- Non fare merge automatico. L'approvazione umana resta obbligatoria.

### Board GitHub

Usa lo stato di lavoro definito nel progetto esistente, altrimenti proponi campi/stati equivalenti: `Inbox`, `Refinement`, `Ready`, `In Progress`, `In Review`, `Blocked`, `Done`. Evita duplicazioni della board. Ogni issue deve essere assegnata a una fase/milestone quando possibile. Aggiorna la board soltanto se l'API/permessi confermano il cambiamento; altrimenti riporta chiaramente l'azione manuale necessaria.

## 14. CI, Vercel e ambienti

- Ambienti separati: Local, Preview, Production; variabili distinte per ambiente.
- Vercel Preview per PR/branch secondo configurazione GitHub-Vercel; Production solo dal branch di produzione dopo merge approvato.
- `.env.example` contiene soltanto nomi e valori placeholder non segreti.
- `.env.local`, chiavi, dump, report, storage locale e credenziali non vanno committati.
- Il CI usa Supabase locale/container con migrazioni e seed; non usa database hosted di produzione.
- Non fare deploy di produzione da Claude Code e non applicare migrazioni remote senza esplicito consenso.
- La CI deve restituire fallimenti chiari e salvare report/log come artifact, ma stampare sommari comprensibili.
- Prevedere controlli su dipendenze e secret scanning disponibili senza acquistare strumenti aggiuntivi non richiesti; motivare eventuali servizi a pagamento.

## 15. Sicurezza applicativa: checklist minima

Adatta OWASP ASVS e OWASP Top 10 alla superficie reale dell'app. In ogni PR considera, quando pertinenti:

- Autenticazione, recupero account, sessione, CSRF e autorizzazione server-side.
- IDOR/BOLA ed enumerazione di ID/slug.
- RLS per lettura, insert, update e delete; test negativi cross-tenant.
- Segreti e privilegi minimi, client/server boundaries, route handlers e server actions.
- XSS in testi, articoli, HTML renderizzato e contenuti importati; encoding/sanitizzazione.
- SSRF/open redirect se vengono implementati fetch di URL o import remoti.
- Upload, dimensioni, MIME, estensioni, malware e controllo di accesso agli asset.
- Rate limits e abuso su login, inviti, invio email, generazione PDF e funzioni costose.
- Link di invito e token: scadenza, monouso, hashing dove appropriato e niente token nei log.
- Realtime: canali e payload autorizzati, niente fuga di informazioni personali.
- Race condition del lock, bypass API e salvataggi dopo expiry.
- CSP/security headers, cookie flags e impostazioni CORS appropriate.
- Audit log: non registrare segreti, token o PII non necessarie.
- Dipendenze, lockfile e vulnerabilità note; non aggiornare major automaticamente senza test.
- Pubblicazione: draft non accessibili anonimamente; snapshot coerenti; asset pubblici solo intenzionalmente.
- Privacy-by-design e minimizzazione dati; definire retention e cancellazione in base alle specifiche approvate.

La revisione di sicurezza deve formulare scenari realistici: attore, prerequisiti, richiesta/azione, impatto, barriera attesa e test che dimostra la barriera. Prioritizza le vulnerabilità che consentirebbero accesso ai dati di altre parrocchie o pubblicazione/modifica non autorizzata.

## 16. Qualità dell'implementazione

- TypeScript strict; evitare `any` senza giustificazione documentata.
- Validare input al boundary (server/API/database), non solo nei form.
- Separare dominio, accesso dati e presentazione senza creare un framework interno eccessivo.
- Componenti UI accessibili da tastiera, focus visibile, label corrette e stati di errore leggibili.
- Per layout responsive, considerare desktop editor e consultazione mobile.
- Nessun testo/URL generato da input utente deve diventare HTML non controllato.
- Error handling con messaggi utente semplici e dettagli tecnici nei log server in modo sicuro.
- Evitare server components/client components non necessari e non inviare segreti o dati privati al client.
- Non introdurre global state finché non necessario; non introdurre realtime per dati che non ne hanno bisogno.
- Evitare test dipendenti da sleep arbitrari; usare aspettative Playwright e condizioni verificabili.
- Non abbassare la qualità dei test per risparmiare tempo. Risparmiare contesto con output compatto, fixture mirate e agenti isolati.
- Nessuna dipendenza o servizio a pagamento nuovo senza descriverne necessità e impatto economico.

## 17. Documentazione e gestione del contesto

- `CLAUDE.md` deve restare sintetico e rimandare a spec, skills e agenti.
- Procedure ricorrenti lunghe vanno in `.claude/skills/`, con istruzioni di invocazione e input/output attesi.
- Agenti specializzati vanno in `.claude/agents/`; il loro compito deve essere chiaro e non sovrapposto.
- Usa hooks per check deterministici quando supportati e realmente utili (per esempio impedire comandi pericolosi o eseguire un controllo leggero); non sostituire controlli sicuri con sole istruzioni testuali.
- Non includere log completi, report JSON, file bundle o output di build nel contesto se basta un riepilogo.
- Quando finisci un task, lascia nel repository lo stato durevole: spec aggiornata, issue/PR, ADR e report. La chat non deve essere l'unico archivio.
- Non affermare di aver letto una documentazione o eseguito un test se non l'hai fatto.

## 18. Comandi e verifica prima di consegnare

Scopri e documenta i comandi effettivi nel repository. Il comando finale di verifica deve orchestrare i check adatti, senza interagire con produzione. Tipicamente:

1. lint/format check;
2. typecheck;
3. unit e integration tests;
4. database locale: reset, migrazioni, seed e test RLS;
5. test E2E Playwright;
6. build di produzione.

Per task puramente documentali, esegui almeno controlli markdown/link e verifica che gli esempi corrispondano ai comandi reali. Per ogni task, esegui prima la suite più mirata e poi i check più ampi richiesti dalla Definition of Done.

## 19. Formato di report per ogni task

Alla fine di ogni incarico, restituisci un resoconto conciso con:

- **Issue/feature:** ID e obiettivo.
- **Spec:** percorsi aggiornati e stato di approvazione.
- **Decisioni:** ADR e trade-off rilevanti.
- **Test-first:** test aggiunti e prova del RED atteso.
- **Implementazione:** riepilogo file/aree modificate.
- **Verifiche:** comandi realmente eseguiti, esito e conteggio; non simulare risultati.
- **Sicurezza:** esito della review e finding aperti.
- **GitHub:** branch, commit, issue, PR e board aggiornati realmente.
- **Rischi/blocchi:** ciò che resta da fare o approvare.
- **Prossimo passo:** singola issue consigliata.

Se un comando fallisce, riferisci il fallimento chiaramente e non segnare la milestone come completata.

## 20. Prima risposta richiesta a Claude Code

Dopo aver letto questo documento e ispezionato repository/ambiente, non iniziare a implementare il prodotto. Esegui il bootstrap della sezione 4 e prepara:

1. una valutazione di quanto esiste già;
2. le specifiche iniziali e la roadmap MVP;
3. gli agenti e le skills nel formato supportato da Claude Code attuale;
4. template PR/issue e workflow GitHub;
5. il piano della board e l'effettivo stato delle operazioni GitHub;
6. la prima issue proposta, preferibilmente “Bootstrap riproducibile locale e CI minima” oppure la prima dipendenza realmente necessaria;
7. le ambiguità bloccanti che richiedono decisione del product owner.

Non creare feature funzionali, non collegare servizi remoti, non fare deploy e non applicare migrazioni remote in questa prima sessione. Fermati al gate di approvazione delle specifiche.

---

**Principio guida:** Communio deve essere costruita come un prodotto affidabile e verificabile, non come una demo generata in massa. Prima chiarire il comportamento, poi scrivere i test, poi implementare, poi verificare in modo indipendente e consegnare tramite PR.