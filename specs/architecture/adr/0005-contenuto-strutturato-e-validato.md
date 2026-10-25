# 0005 — Contenuto strutturato e validato

- **Stato:** Proposed
- **Data:** 2026-10-25
- **Spec:** F-006

## Contesto e problema

Il contenuto editoriale deve essere canonico, validato e renderizzabile in HTML e PDF senza HTML
utente libero. Le sezioni hanno forme diverse (lettura, canti, agenda, avvisi, articolo).

## Opzioni considerate

1. **Sezioni tipizzate con `content jsonb` + schema per tipo, versionato (`schema_version`), validato con una libreria di schema TypeScript** (scelta proposta).
2. Una tabella relazionale per ogni tipo di sezione: rigido, molte migrazioni per ogni campo.
3. HTML/Markdown libero: viola il mandato (§3.1, §3.8).

## Decisione proposta

- `edition_sections(section_type, schema_version, position, content jsonb, version)`.
- Uno schema per `section_type`, definito nel codice con **Zod** (libreria di validazione TypeScript diffusa; dipendenza da approvare in F-006), usato per validare al confine server e per derivare i tipi.
- Testo formattato (articoli, avvisi) come **AST limitato** (paragrafi, grassetto, corsivo, elenchi, link con schema `https`/`mailto`), mai HTML.
- Dati che servono a query o riuso (celebrazioni, selezioni dei canti) possono vivere in tabelle dedicate: decisione per tipo in F-006.
- Migrazioni di `schema_version` gestite da funzioni di upgrade testate; le pubblicazioni conservano la versione con cui sono state create.

## Conseguenze

- Flessibile ed estendibile; validazione unica riusata da editor, server e renderer.
- La validazione in SQL è solo strutturale (tipo jsonb, presenza chiavi): la validazione completa è lato server.
- Rischio: deriva tra schema e dati storici → test di compatibilità sulle versioni.
