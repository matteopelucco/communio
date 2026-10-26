# Vision di prodotto

- **Stato:** In Review
- **Ultimo aggiornamento:** 2026-10-25
- **Approvazione:** in attesa del product owner

## Problema

Molte parrocchie e unità pastorali producono ogni settimana un bollettino o un'agenda liturgica:
Vangelo del giorno, canti, celebrazioni con orari e intenzioni, avvisi, articoli. Oggi il lavoro si
fa tipicamente in un word processor partendo dal numero precedente. Ne derivano:

- impaginazione fragile e tempo speso a sistemare il layout invece che i contenuti;
- errori ripetuti (date, orari, giorni della settimana, celebrazioni sospese non evidenziate);
- nessuno storico consultabile e riusabile in modo strutturato;
- collaborazione difficile: un solo file, versioni divergenti, nessuna traccia di chi ha cambiato cosa;
- distribuzione limitata a PDF/stampa; nessuna pagina web pubblica stabile.

## Visione

**Communio** permette ai redattori parrocchiali, anche non tecnici, di comporre l'edizione settimanale
come **dati strutturati** (celebrazioni, letture, canti, avvisi, articoli) e di ottenere
automaticamente un documento impaginato con identità editoriale curata, pubblicato come **pagina
web**, **PDF stampabile** e **archivio** consultabile.

## Utenti

| Attore                       | Bisogno principale                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| Redattore                    | Comporre l'edizione velocemente, senza errori, riusando lo storico.                |
| Responsabile (es. parroco)   | Controllare e approvare ciò che viene pubblicato.                                  |
| Amministratore organizzazione| Gestire parrocchie, luoghi, utenti e ruoli del proprio tenant.                     |
| Fedele / lettore anonimo     | Consultare l'agenda e il bollettino da smartphone o stampato.                      |
| Gestore del servizio         | Gestire tenant, template e catalogo condiviso dei canti; garantire sicurezza.      |

Un'organizzazione corrisponde a un'unità pastorale ([OQ-01](open-questions.md#oq-01)). Il titolare
sceglie se pubblicano solo i ruoli abilitati o tutti i redattori ([OQ-02](open-questions.md#oq-02)).
Non esiste registrazione libera: si accede con username e password dopo una richiesta di accesso
approvata ([OQ-03](open-questions.md#oq-03)).

## Principi di prodotto

1. **Contenuto prima del layout.** Il redattore compila sezioni guidate; l'impaginazione è del template.
2. **Affidabilità visibile.** Stato di salvataggio sempre esplicito; nessun "salvato" non confermato.
3. **Una persona alla volta in modifica**, con chiarezza su chi sta modificando (lock per edizione).
4. **Pubblicato significa immutabile.** Le correzioni producono una nuova versione, non riscrivono la storia.
5. **Rispetto di persone e diritti.** Minimizzazione dei dati degli utenti dell'applicazione; i
   contenuti pubblicati (intenzioni, recapiti, testi dei canti) sono scelta e responsabilità dell'ente;
   fonte e diritti dei canti si registrano quando rilevante.
6. **Locale e indipendente.** Funziona senza provider AI; l'AI, quando arriverà, propone e non decide.
7. **Italiano, accessibile, mobile-friendly** per la consultazione.

## Cosa Communio non è (nell'MVP)

- Non è un editor desktop-publishing libero né un editor HTML.
- Non è uno strumento di collaborazione in tempo reale a livello di carattere.
- Non è una fonte liturgica ufficiale: i contenuti liturgici sono inseriti e verificati da persone.
- Non gestisce donazioni, prenotazioni, anagrafe parrocchiale o pagamenti.

## Indicatori di successo (proposti, da validare con il product owner)

- Tempo di preparazione di un'edizione settimanale partendo dalla precedente: obiettivo ≤ 30 minuti.
- Zero pubblicazioni con dati di altri tenant o bozze esposte (vincolo, non obiettivo).
- PDF stampabile senza interventi manuali per il template iniziale su contenuti tipici (2 pagine A4).
- Consultazione pubblica leggibile su smartphone (WCAG 2.2 AA come riferimento).

## Riferimenti

- Mandato: [docs/communio-master-prompt.md](../../docs/communio-master-prompt.md)
- Scope MVP: [mvp-scope.md](mvp-scope.md)
- Bollettino di riferimento: [reference-bulletin-analysis.md](reference-bulletin-analysis.md)
