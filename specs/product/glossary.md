# Glossario

- **Stato:** In Review
- **Ultimo aggiornamento:** 2026-10-25

Termini in italiano (dominio, UI) con il nome inglese usato nel codice e nel database.

## Dominio organizzativo

| Termine | Codice | Definizione |
| --- | --- | --- |
| Gestore del servizio | `service_admin` | Chi opera la piattaforma Communio: tenant, template, catalogo condiviso. Non è un utente di una parrocchia. |
| Organizzazione (tenant) | `organization` | Confine di isolamento dei dati e di amministrazione. Corrisponde a un'unità pastorale o a una parrocchia singola ([OQ-01](open-questions.md#oq-01)). |
| Titolare | `owner` | Ruolo più alto dell'organizzazione; sceglie la politica di pubblicazione ([OQ-02](open-questions.md#oq-02)). |
| Politica di pubblicazione | `publishing_policy` | Impostazione dell'organizzazione: `restricted` (pubblica solo chi ha il ruolo) o `open` (pubblicano tutti i membri che modificano) ([OQ-02](open-questions.md#oq-02)). |
| Richiesta di accesso | `access_request` | Domanda inviata tramite form pubblico da chi vuole un account; sostituisce la registrazione libera ([OQ-03](open-questions.md#oq-03)). |
| Unità pastorale | `pastoral unit` | Insieme di parrocchie guidate da un'unica équipe pastorale che può pubblicare un bollettino comune. |
| Comunità pastorale | — | Forma di unità pastorale della Diocesi di Milano; trattata come unità pastorale. |
| Parrocchia | `parish` | Comunità con nome (es. "S. Ambrogio in …"), timezone, impostazioni. Appartiene a un'organizzazione. |
| Luogo di culto | `place` | Chiesa, santuario, oratorio o cappella in cui si svolge un evento (es. "chiesetta di frazione"). Appartiene a una parrocchia. Entità aggiunta rispetto al mandato: vedi [data-model](../architecture/data-model.md). |
| Membro | `membership` | Relazione utente ↔ organizzazione con un ruolo. |
| Profilo | `profile` | Dati applicativi minimi dell'utente (nome visualizzato), collegati a Supabase Auth. |

## Dominio editoriale

| Termine | Codice | Definizione |
| --- | --- | --- |
| Bollettino / Agenda settimanale | `edition` | Il documento periodico. Nel campione si chiama "Agenda settimanale". |
| Edizione | `edition` | Un singolo numero: intervallo di date, anno di pubblicazione (es. "Anno XII"), numero progressivo (es. "N. 6"), stato. |
| Intervallo dell'edizione | `period_start`, `period_end` | Date coperte. **Non** necessariamente 7 giorni (il campione copre sabato→lunedì della settimana dopo, 10 giorni). |
| Sezione | `edition_section` | Blocco tipizzato e ordinato dell'edizione (es. Vangelo, Canti, Agenda, Avvisi, Articolo). |
| Tipo di sezione | `section_type` | Schema del contenuto di una sezione, validato e versionato. |
| Avvisi ("Appunti di viaggio") | `notices` | Elenco di comunicazioni brevi. Il titolo è personalizzabile. |
| Articolo | `article` | Testo con titolo, corpo formattato in modo controllato, immagine opzionale. |
| Bozza | `draft` | Edizione modificabile, mai visibile pubblicamente. |
| In revisione | `in_review` | Edizione in attesa di approvazione alla pubblicazione. Obbligatorietà: [OQ-13](open-questions.md#oq-13). |
| Pubblicazione | `publication` | Snapshot immutabile di un'edizione con versione del template, HTML e PDF. |
| Archiviazione | `archived` | Edizione non più corrente; resta consultabile secondo le regole dell'archivio. |
| Revisione (versione) | `edition_revision` | Snapshot auditabile di una bozza in un dato momento. Da non confondere con lo stato "in revisione". |
| Template | `template` | Layout grafico versionato, gestito dal gestore del servizio. |
| Lock di modifica | `edition_lock` | Diritto esclusivo e temporaneo di modificare un'edizione, legato a una sessione di browser (tab). |
| Heartbeat | — | Rinnovo periodico del lock da parte della sessione proprietaria. |
| Sessione di editing | `editor_session_id` | Token casuale per tab, generato dal client e conservato in `sessionStorage`. |

## Dominio liturgico

| Termine | Codice | Definizione |
| --- | --- | --- |
| Rito | `rite` | Rito liturgico: **romano** o **ambrosiano** (Diocesi di Milano). Influenza calendario, letture e momenti della messa. |
| Calendario liturgico | `liturgical_calendar` | Configurazione della parrocchia (rito, proprio diocesano). Nell'MVP è un'impostazione, non un motore di calcolo. |
| Giorno liturgico / ricorrenza | `liturgical_day` | Denominazione del giorno (es. "Dedicazione del Duomo di Milano", "I domenica dopo la Dedicazione") o santi del giorno. |
| Colore liturgico | `liturgical_color` | Bianco, rosso, verde, viola, rosa, nero (il campione lo mostra come quadratino colorato accanto al giorno). |
| Celebrazione | `celebration` | Evento con data, ora, luogo, tipo (S. Messa, Rosario, Cresime…), intenzioni e note. |
| Messa vigiliare | `vigil` | Messa del sabato sera valida per la domenica. |
| Intenzione | `intention` | Ricordo associato a una messa, spesso nomi di defunti ("def. …"). Pubblicata in HTML e PDF come nel cartaceo, sotto la responsabilità dell'ente ([OQ-04](open-questions.md#oq-04)). |
| Celebrazione sospesa | `cancelled` | Celebrazione abituale che non si tiene; va evidenziata (il campione la evidenzia in rosso). |
| Lettura | `reading` | Brano biblico con riferimento (es. "Mt 21, 10-17") e testo. |
| Momento liturgico | `liturgical_moment` | Punto della celebrazione in cui si esegue un canto. Ambrosiano include es. "Dopo il Vangelo", "Allo spezzare del pane". |
| Lezionario | `lectionary` | Fonte ufficiale delle letture. Nell'MVP le letture sono inserite manualmente; fonti automatiche sono post-MVP. |

## Canti

| Termine | Codice | Definizione |
| --- | --- | --- |
| Canto | `song` | Voce di catalogo: titolo, autori, fonte, temi, momenti adatti, riferimenti biblici, stato dei diritti. |
| Catalogo condiviso | `shared catalog` | Canti curati dal gestore del servizio e visibili a più tenant. Non implica libertà di riproduzione del testo. |
| Catalogo locale | `local song` | Canti creati da un'organizzazione, visibili solo al tenant. |
| Repertorio | `song_repertoire` | Selezione di canti (es. "Repertorio della corale", "Avvento"). |
| Selezione per l'edizione | `edition_song_selection` | Canto scelto per un momento liturgico di una celebrazione o dell'edizione. |
| Stato dei diritti | `rights_status` | Es. pubblico dominio, licenza concessa, sconosciuto. Si registra quando rilevante (mandato §7); se limiti la pubblicazione del testo è in [OQ-16](open-questions.md#oq-16). |

## Termini tecnici

| Termine | Definizione |
| --- | --- |
| RLS | Row Level Security di PostgreSQL: policy per riga applicate dal database. |
| RPC | Funzione PostgreSQL invocata via Supabase (`rpc`). |
| `SECURITY DEFINER` | Funzione eseguita con i privilegi del proprietario; richiede `search_path` fisso e controlli espliciti. |
| Optimistic concurrency | Aggiornamento condizionato a un numero di versione atteso, per impedire scritture obsolete. |
| Snapshot | Copia immutabile del contenuto canonico usata per la pubblicazione. |
| Adapter / provider | Implementazione intercambiabile dietro un'interfaccia applicativa (email, AI, fonti). |
| DoR / DoD | Definition of Ready / Definition of Done (vedi [github-workflow](../operations/github-workflow.md)). |
