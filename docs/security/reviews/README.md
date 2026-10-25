# Security review

Report delle revisioni di sicurezza indipendenti (agente `security-reviewer`). Un file per revisione:
`AAAA-MM-GG-<pr-o-issue>-<slug>.md`. Modello di riferimento:
[specs/architecture/security-model.md](../../../specs/architecture/security-model.md).

> Repository pubblico: i report su vulnerabilità **non ancora corrette** di gravità High/Critical non
> si committano con i dettagli di sfruttamento finché la correzione non è mergiata. Si registra il
> finding in forma sintetica e si conservano i dettagli in un canale privato del responsabile.

## Template

```markdown
# Security review — <PR/issue> — <titolo>

- Data: AAAA-MM-GG
- Revisore: security-reviewer (Claude Code) — revisione indipendente
- Ambito: commit/diff, file, spec
- Ambiente: locale (nessun test su produzione o terze parti)

## Sintesi

| Severità | Numero |
| --- | --- |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Informational | 0 |

Verdetto: blocca | non blocca

## Threat model (delta)

Attori, asset, superfici nuove o modificate.

## Finding

### SEC-<n> — <titolo> (<severità>)

- Attore e prerequisiti:
- Percorso di abuso (richiesta/azione):
- Impatto:
- Probabilità:
- Evidenza (file:riga, comando, output sintetico):
- Barriera attesa:
- Remediation verificabile (incluso il test che la dimostra):
- Stato: aperto | risolto in <commit> | rischio accettato da <chi, quando>

## Controlli eseguiti

Comandi reali ed esito sintetico.

## Limiti

Cosa non è stato verificato e perché.
```
