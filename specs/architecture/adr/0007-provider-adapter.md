# 0007 — Provider adapter per email, AI e fonti esterne

- **Stato:** Proposed
- **Data:** 2026-10-25
- **Spec:** F-003 (email); AI e fonti liturgiche post-MVP · Mandato §3.10, §11

## Decisione proposta

- Interfacce applicative minime nel codice server (`server-only`):
  - `EmailProvider.send(message): Promise<SendResult>` con implementazioni `local` e `resend`.
  - `AiProvider` (post-MVP) con implementazioni `none` e `mock`; nessuna dipendenza AI nel core.
  - `LiturgicalSource` (post-MVP) con provenienza (fonte, data/versione, stato di verifica).
- Selezione tramite variabile d'ambiente validata all'avvio (`EMAIL_PROVIDER=local` default).
- `local`: scrive un messaggio sanitizzato in un outbox locale (file JSON in `artifacts/outbox/` o tabella dedicata — da decidere in F-003), nessuna rete.
- `resend`: attivo solo con `EMAIL_PROVIDER=resend` e `RESEND_API_KEY`, `EMAIL_FROM` presenti; errore esplicito all'avvio se mancano.
- Fuori produzione: allowlist dei domini destinatari; i test usano solo `local` o un fake.
- Idempotenza degli invii sensibili tramite chiave di idempotenza per evento (es. id invito).
- Mai loggare token, link segreti completi o corpi email integrali.

## Conseguenze

- Sviluppo e test offline; provider sostituibili senza toccare il dominio.
- Le email di Supabase Auth seguono un canale distinto (SMTP di Supabase; mail catcher in locale).
