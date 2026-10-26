# Analisi del bollettino di riferimento

- **Stato:** In Review
- **Ultimo aggiornamento:** 2026-10-25
- **Fonte:** campione fornito dal product owner (PDF + DOCX, 2 pagine A4), conservato **fuori dal
  versionamento** perché contiene dati personali reali. Percorso locale consigliato:
  `docs/reference-private/` (ignorato da Git).

Questa analisi descrive **struttura e regole** del campione senza riportarne dati personali
(nomi di defunti, numeri di telefono, nomi di privati) né testi integrali di canti. Gli esempi usano
dati fittizi.

## Caratteristiche generali

- Agenda settimanale di **un'unità pastorale con tre parrocchie** della Diocesi di Milano:
  **rito ambrosiano**.
- Periodo coperto: **10 giorni**, da sabato a lunedì della settimana successiva. Le edizioni
  consecutive si sovrappongono (il sabato vigiliare apre l'edizione).
- Numerazione: "Anno XII – N. 6" (anno di pubblicazione in numeri romani, numero progressivo).
  Regola di reset del numero (annuale? per anno pastorale?) da chiarire: [OQ-07](open-questions.md#oq-07).
- Due pagine A4, testata a colori, tabelle con bordi, palette blu.

## Sezioni individuate → tipi di sezione proposti

| # | Sezione nel campione | Tipo proposto (`section_type`) | Contenuto strutturato |
| --- | --- | --- | --- |
| 1 | Testata | (attributi di edizione e organizzazione, non una sezione) | Anno, numero, intervallo date, nome unità pastorale, elenco parrocchie. |
| 2 | Contatti (parroco, segreteria, link community) | `contacts` o impostazioni organizzazione | Ruolo, nome, recapiti, link. Pubblicati come nel cartaceo, sotto la responsabilità dell'ente ([OQ-04](open-questions.md#oq-04)). |
| 3 | Titolo della festa + Vangelo | `reading` | Titolo del giorno liturgico, riferimento biblico, testo, fonte/traduzione. |
| 4 | "Cantiamo insieme" | `songs` | Righe *momento liturgico → canto*; per ogni canto: titolo/incipit, ritornello, strofe; evidenziazione del ritornello (grassetto). |
| 5 | Agenda | `agenda` | Giorni dell'intervallo; per giorno: data, ricorrenza/santi, colore liturgico, elenco eventi o "nulla da segnalare". |
| 6 | "Appunti di viaggio" | `notices` | Elenco di avvisi brevi con enfasi limitata (grassetto, evidenziazione nome iniziativa). |
| 7 | Articolo con immagine | `article` | Titolo, corpo, immagine con posizione (destra), testo introduttivo in grassetto. |

## Agenda: regole osservate

- **Giorno:** giorno della settimana + data; denominazione liturgica opzionale (festa, santi,
  "vigiliare della domenica").
- **Colore liturgico:** un quadratino per giorno (rosso, bianco, verde nel campione). Da
  modellare come dato (`liturgical_color`), non come grafica libera.
- **Evidenziazione dei giorni festivi:** sabato e domenica con sfondo diverso.
- **Evento:** ora, località/luogo di culto (talvolta con chiesa specifica: "Paese (S. Rocco)",
  "Paese (Santuario)", una chiesetta di frazione), tipo di evento, intenzioni ("def …") e note.
- **Celebrazione sospesa:** evidenziata in rosso e maiuscolo ("la messa delle 11:00 a … è sospesa").
  Va modellata come stato `cancelled` della celebrazione abituale, non come testo libero.
- **Nessun evento:** "Nulla da segnalare" generato automaticamente quando il giorno non ha eventi.
- Eventi non liturgici (es. rosario perpetuo, cresime) convivono con le messe.

## Problemi di leggibilità da migliorare nel template v1

1. Densità elevata e corpo del testo piccolo, soprattutto nelle intenzioni (corsivo minuto).
2. Etichette dei momenti liturgici in maiuscoletto blu, a volte spezzate su due righe.
3. Colore liturgico come quadratino senza legenda: non accessibile a chi non distingue i colori
   (serve testo alternativo / etichetta).
4. Evidenziazione in rosso come unico segnale di sospensione: serve anche un'indicazione testuale/icona.
5. Link (es. community) stampati come URL abbreviati: prevedere QR code opzionale nel PDF (proposta,
   da approvare).
6. Righe di canto lunghe senza gerarchia chiara tra ritornello e strofe.

## Implicazioni per il modello dati

- Serve un'entità **luogo di culto** (`places`) sotto la parrocchia: i luoghi sono più granulari delle
  parrocchie.
- L'edizione appartiene all'organizzazione e copre **più parrocchie**.
- Le celebrazioni sono dati strutturati riusabili (duplicazione, celebrazioni ricorrenti future).
- Le intenzioni si pubblicano in HTML e PDF come nel cartaceo; la scelta e la responsabilità sono
  dell'ente ([OQ-04](open-questions.md#oq-04), decisa).
- I momenti liturgici dipendono dal **rito** (ambrosiano: "Dopo il Vangelo", "Allo spezzare del pane").

## Esempio fittizio (struttura)

```text
Sabato 7 novembre — S. Esempio, vescovo — Vigiliare della domenica   [colore: bianco]
  - Ore 18:00 a Borgo Alto (S. Maria): S. Messa (def. Mario Rossi)
Domenica 8 novembre — II domenica dopo la Dedicazione                  [colore: verde]
  - Ore 9:30 a Valle (S. Giovanni): S. Messa
  - [SOSPESA] Ore 11:00 a Borgo Alto: S. Messa
Lunedì 9 novembre                                                       [colore: verde]
  - Nulla da segnalare
```
