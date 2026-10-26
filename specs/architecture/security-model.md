# Modello di sicurezza

- **Stato:** In Review
- **Ultimo aggiornamento:** 2026-10-25
- **Riferimenti:** OWASP Top 10, OWASP ASVS (adattato), mandato §10, §11, §15

## Asset da proteggere

| Asset | Perché conta |
| --- | --- |
| Bozze e contenuti interni delle edizioni | Non devono essere pubblici prima della pubblicazione. |
| Dati personali degli utenti e dei richiedenti di accesso | GDPR; reputazione delle parrocchie. Intenzioni e recapiti **pubblicati** sono scelta e responsabilità dell'ente ([OQ-04](../product/open-questions.md#oq-04)), ma finché restano in bozza sono dati interni da proteggere. |
| Isolamento tra organizzazioni | Il rischio più grave: dati di una parrocchia visibili/modificabili da un'altra. |
| Integrità delle pubblicazioni | Un bollettino pubblicato non deve cambiare né essere falsificato. |
| Credenziali e segreti (Supabase service role, Resend, AI) | Compromissione totale. |
| Reputazione del dominio email | Abuso degli inviti per spam/phishing. |

## Attori di minaccia

1. **Anonimo** su Internet: enumerazione URL, accesso a bozze, XSS sulle pagine pubbliche, abuso di endpoint costosi (PDF).
2. **Utente autenticato di un altro tenant:** IDOR/BOLA, RLS mancante, Realtime e Storage cross-tenant.
3. **Membro con ruolo basso** (`viewer`/`editor`): escalation (pubblicare, gestire membri).
4. **Redattore autorizzato ma in conflitto:** scrittura senza lock, dopo expiry o con versione obsoleta.
5. **Contenuti ostili:** testo/immagini caricate, import futuri, output AI (prompt injection).
6. **Sviluppatore/agente in errore:** segreti committati, migrazioni manuali remote, reset distruttivi.

## Superfici e controlli

| Superficie | Minacce principali | Controlli previsti | Verifica |
| --- | --- | --- | --- |
| Auth e sessione | furto sessione, CSRF, enumerazione account, brute force, credential stuffing | Email (come username) e password ([OQ-03](../product/open-questions.md#oq-03), [OQ-14](../product/open-questions.md#oq-14)) con Supabase Auth; cookie `HttpOnly`/`Secure`/`SameSite=Lax` via `@supabase/ssr`; Server Actions con protezione origin di Next; policy password; limitazione dei tentativi; messaggi d'errore non enumerativi; recupero password con link monouso | E2E login/logout; test risposta uniforme; test rate limit |
| Richiesta di accesso (form pubblico) | spam e bot, abuso delle email di notifica, enumerazione degli account o delle organizzazioni, raccolta eccessiva di dati, approvazione da parte di chi non ne ha titolo | Endpoint server con validazione e rate limit per IP e per email; anti-bot senza servizi esterni (es. honeypot; un captcha di terzi richiede approvazione); risposta identica qualunque sia l'esito; dati minimi; tabella non leggibile da `anon`; approvazione riservata al `service_admin` ([OQ-15](../product/open-questions.md#oq-15)) e registrata in audit | Integrazione + E2E; test negativi sull'approvazione |
| Politica di pubblicazione | escalation (pubblicare con `restricted` senza ruolo), cambio non autorizzato della politica | Verifica di ruolo e `publishing_policy` nella funzione di pubblicazione (SQL/server); solo l'`owner` modifica la politica; cambio registrato in audit ([OQ-02](../product/open-questions.md#oq-02)) | pgTAP + integrazione per entrambe le politiche |
| Autorizzazione dati | IDOR/BOLA, leakage tra tenant | RLS su **tutte** le tabelle esposte; FK composite tenant; funzioni helper `is_member(org)`/`has_role(org, roles)` `STABLE SECURITY DEFINER` con `search_path` vuoto | pgTAP positivi e **negativi** per ogni policy (select/insert/update/delete) |
| Privilegi SQL | grant eccessivi ad `anon`/`authenticated` | Revoca dei default, grant espliciti minimi; `anon` legge solo le viste pubbliche | pgTAP su `has_table_privilege` |
| RPC `SECURITY DEFINER` | bypass RLS, search_path hijacking | `set search_path = ''`, nomi qualificati, verifica `auth.uid()` e membership all'inizio, `revoke execute from public` | Test negativi per ogni RPC |
| Lock ed editing | race condition, write dopo expiry, bypass API | Acquisizione atomica (`insert … on conflict … where expires_at < now()`), verifica sessione+lock+versione in ogni mutazione | Test concorrenti ripetibili (integrazione) + E2E con due browser |
| Realtime | eventi privati a non autorizzati | Canali privati con autorizzazione Realtime/RLS; payload minimi (id e display name) | Test sottoscrizione cross-tenant negativa |
| Storage | accesso a file privati, upload malevoli | Bucket privati, path con `organization_id`, policy su `storage.objects`, verifica MIME da contenuto, limiti di dimensione, nessun SVG non sanificato | Integrazione + review |
| Pubblicazione pubblica | bozze esposte, enumerazione | Rotte pubbliche leggono solo `publications` pubblicate; nessuna lettura di bozze "nascoste" lato client; archivio pubblico e pagine visibili a tutti ([OQ-06](../product/open-questions.md#oq-06)): proprio per questo ogni dato non pubblicato deve restare irraggiungibile da `anon` | E2E anonimo; test che una bozza dà 404 |
| Rendering HTML/PDF | XSS, SSRF da Chromium, DoS | Contenuto strutturato renderizzato da React (escaping); rich text con modello AST limitato, niente `dangerouslySetInnerHTML` su input utente; Chromium senza accesso a URL arbitrari (solo asset locali/consentiti); rate limit e timeout | Test XSS; spike #14 |
| Email e inviti | spam, phishing, token leakage | Token casuale ≥ 128 bit, salvato come hash, monouso, scadenza; nessun token nei log; destinatari limitati in local/test; rate limit per organizzazione | Unit + integrazione con provider `local` |
| Segreti | commit, bundle client, log | `.env.local` ignorato; solo `NEXT_PUBLIC_*` non segreti al client; `server-only` per moduli con segreti; secret scanning | Check CI (#5), review |
| Header | clickjacking, XSS, MIME sniffing | CSP con nonce, `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS in hosted | Test sugli header (#5) |
| Dipendenze | vulnerabilità note | Lockfile; `npm audit --audit-level=high` in CI; Dependabot senza auto-merge | CI (#5) |
| AI e import (post-MVP) | prompt injection, contenuti ostili | Output trattato come input non attendibile, solo proposte approvabili, provenienza registrata | Threat model dedicato alla feature |

## Ripartizione dei controlli

Per ogni operazione sensibile la specifica di feature deve compilare questa tabella. Esempio per il lock:

| Controllo | SQL/RPC | Server Next.js | Solo UX |
| --- | --- | --- | --- |
| Utente autenticato | `auth.uid()` non nullo | sessione valida | redirect a login |
| Membership e ruolo | helper in RPC + RLS | verifica prima della chiamata | pulsanti disabilitati |
| Lock posseduto da questa sessione e non scaduto | condizione nella mutazione | — (delegato a SQL) | editor in sola lettura |
| Versione attesa | `where version = expected` | mappa conflitto → errore utente | banner "contenuto cambiato" |
| Validazione contenuto | check di forma minimi (jsonb type) | schema completo per `section_type` | validazione del form |

## Regole di severità per le review

| Severità | Esempi | Effetto |
| --- | --- | --- |
| Critical | Accesso/modifica cross-tenant, segreto esposto, bozza pubblica | Blocca la PR |
| High | Escalation di ruolo, XSS memorizzato, token riusabile | Blocca la PR salvo accettazione del rischio documentata dal responsabile |
| Medium | Rate limit mancante su endpoint costoso, header incompleti | Issue di follow-up con milestone |
| Low / Informational | Hardening, igiene | Annotazione nel report |

I report sono in [docs/security/reviews/](../../docs/security/reviews/README.md).

## Fuori perimetro

Nessun test di penetrazione su produzione o servizi di terzi senza autorizzazione scritta.
