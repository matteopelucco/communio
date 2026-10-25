# Scope MVP

- **Stato:** Approved
- **Ultimo aggiornamento:** 2026-10-25
- **Approvazione:** product owner, 2026-10-25: approvazione della PR #18 (gate del mandato §4.14) e
  decisioni OQ-01…OQ-05 in [open-questions.md](open-questions.md)

Questo documento numera i requisiti MVP (`MVP-xx`) e i requisiti non funzionali trasversali
(`NFR-xx`). Ogni requisito è dettagliato in una specifica di feature (`F-NNN`) prima
dell'implementazione. La mappatura completa è in [traceability.md](../quality/traceability.md).

## Requisiti funzionali MVP

| ID | Requisito | Feature | Note |
| --- | --- | --- | --- |
| MVP-01 | Autenticazione e sessione utente con username e password. | F-002 | Decisa [OQ-03](open-questions.md#oq-03); identificativo: [OQ-14](open-questions.md#oq-14). |
| MVP-02 | Organizzazioni tenant (= unità pastorale), parrocchie (e luoghi di culto), utenti e ruoli. | F-001, F-002 | Decise [OQ-01](open-questions.md#oq-01) e [OQ-02](open-questions.md#oq-02). |
| MVP-03 | Dashboard delle edizioni e ciclo bozza → revisione → pubblicazione → archiviazione, con politica di pubblicazione dell'organizzazione (`restricted` o `open`) scelta dal titolare. | F-005 | Decisa [OQ-02](open-questions.md#oq-02); revisione obbligatoria: [OQ-13](open-questions.md#oq-13). |
| MVP-04 | Editor modulare con sezioni strutturate, ordinate e validate. | F-006 | Tipi di sezione iniziali derivati dal [campione](reference-bulletin-analysis.md). |
| MVP-05 | Modifica esclusiva per edizione con lock legato alla sessione di browser; gli altri leggono in sola lettura e vedono chi modifica. | F-007 | Parametri: heartbeat 30 s, scadenza 90 s (proposta, [ADR-0004](../architecture/adr/0004-lock-di-modifica-esclusivo.md)). |
| MVP-06 | Autosalvataggio affidabile, stato esplicito di salvataggio/errore, protezione da scritture obsolete. | F-007 | Optimistic concurrency con numero di versione. |
| MVP-07 | Anteprima del documento durante la modifica. | F-009 | Stesso renderer della pubblicazione. |
| MVP-08 | Un template iniziale, ispirato al bollettino di riferimento ma più leggibile. | F-009 | |
| MVP-09 | Pubblicazione versionata in HTML, PDF scaricabile e archivio pubblico. | F-010 | Fattibilità PDF su Vercel: spike #14. |
| MVP-10 | Catalogo canti e repertori: catalogo condiviso e selezioni locali, con testi completi. | F-011 | Decisa [OQ-05](open-questions.md#oq-05); curatela e licenze: [OQ-16](open-questions.md#oq-16). |
| MVP-11 | Duplicazione/riuso di un'edizione storica senza modificare l'originale. | F-008 | |
| MVP-12 | Audit degli eventi essenziali. | F-004 | |
| MVP-13 | Email applicative (es. inviti) dietro adapter: `local` in sviluppo/test, Resend in hosted. | F-003 | Derivato da mandato §11. |
| MVP-14 | Nessuna registrazione libera: form pubblico di richiesta di accesso, valutata prima della creazione dell'account. | F-002 | Decisa [OQ-03](open-questions.md#oq-03); gestione: [OQ-15](open-questions.md#oq-15). |

## Requisiti non funzionali trasversali

| ID | Requisito | Verifica |
| --- | --- | --- |
| NFR-01 | Isolamento multi-tenant: nessun accesso a dati di altre organizzazioni via UI, API, RPC, Realtime o Storage. | Test RLS/pgTAP negativi cross-tenant; E2E con due tenant. |
| NFR-02 | Autorizzazione e validazione lato server/DB per ogni mutazione. | Test di integrazione che bypassano la UI. |
| NFR-03 | Local-first: clone pulito funzionante con soli servizi locali; nessuna chiamata a Resend o AI in dev/test. | `npm run verify` su CI senza segreti hosted. |
| NFR-04 | Interfaccia in italiano, messaggi d'errore comprensibili per non tecnici. | Revisione spec + E2E sui messaggi. |
| NFR-05 | Accessibilità: navigazione da tastiera, focus visibile, label, contrasto. Riferimento WCAG 2.2 AA. | Controlli automatici (axe) negli E2E + checklist PR. |
| NFR-06 | Responsive: editor desktop-first; consultazione pubblica mobile-first. | E2E su viewport desktop e mobile. |
| NFR-07 | No silent failure: stati "salvato/pubblicato/inviato" solo dopo conferma del server. | Test E2E con errori simulati. |
| NFR-08 | Sicurezza dei contenuti: nessun HTML arbitrario non sanificato; CSP e security headers. | Test XSS; review di sicurezza. |
| NFR-09 | Minimizzazione dei dati personali degli utenti dell'applicazione (profili, richieste di accesso, log, audit); nessuna PII o token nei log. I contenuti editoriali pubblicati sono responsabilità dell'ente (OQ-04). | Review di sicurezza; test sul logger. |
| NFR-10 | Snapshot pubblicati immutabili; HTML e PDF dallo stesso snapshot. | Test di integrazione su publications. |
| NFR-11 | Prestazioni (proposta): anteprima aggiornata entro 1 s dal salvataggio su contenuti tipici; pagina pubblica LCP < 2,5 s su mobile 4G. | Da confermare in F-009/F-010. |
| NFR-12 | Nessuna dipendenza da provider AI nel core. | Build e test senza variabili AI. |

## Fuori scope MVP

Implementabili **solo** con issue e specifica approvate (mandato §1):

- Importazione assistita da PDF/DOCX e OCR.
- Fonti liturgiche automatiche (letture, ricorrenze) con provenienza e verifica umana.
- Suggerimenti AI per canti e contenuti; generazione assistita di bozze.
- Editor avanzato dei template.
- Piani commerciali, abbonamenti, quote, pagamenti.
- Notifiche avanzate, approvazioni multilivello, ricerca semantica.
- Collaborazione in tempo reale a livello di carattere (CRDT).
- Lingue diverse dall'italiano.

## Assunzioni dichiarate

- **A-01:** Un'edizione appartiene a un'organizzazione e può riguardare più parrocchie (il campione copre tre parrocchie in un unico bollettino). Confermata da OQ-01.
- **A-02:** Le letture e le ricorrenze liturgiche sono inserite manualmente nell'MVP.
- **A-03:** Il formato di stampa iniziale è A4 verticale; il campione è di 2 pagine.
- **A-04:** I testi completi dei canti possono essere memorizzati e riportati nell'edizione ([OQ-05](open-questions.md#oq-05)); fonte e stato dei diritti si registrano quando rilevante (mandato §7).
- **A-06:** Intenzioni e recapiti inseriti dal redattore si pubblicano in HTML e PDF come nel cartaceo; contenuti e responsabilità sono dell'ente ([OQ-04](open-questions.md#oq-04)).
- **A-05:** Timezone predefinita `Europe/Rome`; date e orari visualizzati in formato italiano.
