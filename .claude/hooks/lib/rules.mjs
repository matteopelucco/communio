// Pure decision logic for the project's Claude Code hooks. No I/O here, so it can be
// unit-tested with `node --test ".claude/hooks/*.test.mjs"`.

import path from 'node:path';

/** @typedef {{ decision: 'deny' | 'ask', reason: string }} Decision */

/** @type {{ decision: 'deny' | 'ask', pattern: RegExp, reason: string }[]} */
export const COMMAND_RULES = [
  // GitHub: merge and repository-level settings are human-only (mandate §13).
  { decision: 'deny', pattern: /\bgh\s+pr\s+merge\b/i, reason: "Il merge delle PR è riservato all'approvazione umana (mandato §13)." },
  { decision: 'deny', pattern: /\bgh\s+repo\s+(delete|archive|rename)\b/i, reason: 'Operazione distruttiva sul repository non consentita.' },
  { decision: 'deny', pattern: /\bgh\s+api\b(?=.*(branches\/\S+\/protection|\/rulesets))(?=.*(-X|--method)\s*(PUT|POST|PATCH|DELETE)\b)/i, reason: 'Protezioni di branch e ruleset si modificano solo con autorizzazione esplicita.' },
  { decision: 'ask', pattern: /\bgh\s+(secret|variable)\s+(set|delete|remove)\b/i, reason: 'Modifica di segreti/variabili GitHub: richiede approvazione esplicita.' },
  { decision: 'ask', pattern: /\bgh\s+repo\s+edit\b/i, reason: 'Modifica delle impostazioni del repository: richiede approvazione esplicita.' },

  // Git: no force push, no hook bypass, no direct push to main.
  { decision: 'deny', pattern: /\bgit\s+push\b.*\s(--force(?!-with-lease)|-f)\b/i, reason: 'Force push non consentito.' },
  { decision: 'ask', pattern: /\bgit\s+push\b.*\s--force-with-lease\b/i, reason: 'Force push with lease: confermare che il branch non sia condiviso.' },
  { decision: 'deny', pattern: /\bgit\s+push\b.*\s(\S+:)?(refs\/heads\/)?(main|master)(\s|$)/i, reason: 'Push diretto su main non consentito: usare un branch e una PR.' },
  { decision: 'deny', pattern: /\bgit\s+(commit|push)\b.*\s--no-verify\b/i, reason: 'Bypass degli hook Git non consentito.' },
  { decision: 'ask', pattern: /\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f)/i, reason: 'Comando Git distruttivo: confermare che non ci siano modifiche da preservare.' },

  // Supabase: never reset a remote database; remote operations need approval (mandate §10).
  { decision: 'deny', pattern: /\bsupabase\s+db\s+reset\b.*\s(--linked|--db-url)\b/i, reason: 'Reset di un database Supabase remoto vietato (mandato §10).' },
  { decision: 'ask', pattern: /\bsupabase\s+(db\s+push|link|migration\s+repair|functions\s+deploy|secrets\s+(set|unset)|projects\s+(create|delete))\b/i, reason: 'Operazione su Supabase remoto: indicare il target e ottenere approvazione esplicita.' },
  { decision: 'ask', pattern: /\bsupabase\b.*\s--linked\b/i, reason: 'Comando Supabase sul progetto remoto collegato: richiede approvazione esplicita.' },

  // Vercel: no production deploys from Claude Code (mandate §14).
  { decision: 'deny', pattern: /\bvercel\b.*\s(--prod|promote|alias)\b/i, reason: 'Deploy o promozione in produzione vietati da Claude Code (mandato §14).' },
  { decision: 'ask', pattern: /\bvercel\s+(deploy|env|link|rollback|remove|rm)\b/i, reason: 'Operazione Vercel remota: richiede approvazione esplicita.' },

  // Filesystem roots.
  { decision: 'deny', pattern: /\brm\s+-[a-z]*r[a-z]*\s+(\/|~|\$HOME|\/c\/?|[a-z]:[\\/]?)(\s|$)/i, reason: 'Cancellazione ricorsiva di una radice del filesystem.' },
];

/**
 * Evaluates a shell command. Returns null when the command may proceed through the
 * normal permission flow.
 * @param {string} command
 * @param {{ branch?: string | null }} [context]
 * @returns {Decision | null}
 */
export function evaluateCommand(command, context = {}) {
  for (const rule of COMMAND_RULES) {
    if (rule.pattern.test(command)) return { decision: rule.decision, reason: rule.reason };
  }
  const onMain = context.branch === 'main' || context.branch === 'master';
  if (onMain && /\bgit\s+commit\b/i.test(command)) {
    return { decision: 'deny', reason: 'Commit su main non consentito: creare un branch tipo/<issue>-slug.' };
  }
  // A push without an explicit refspec from main would update main.
  if (onMain && /\bgit\s+push(\s+(-u|--set-upstream|origin))*\s*($|[;&|])/i.test(command)) {
    return { decision: 'deny', reason: 'Push da main non consentito: usare un branch e una PR.' };
  }
  return null;
}

/**
 * Write scopes per agent profile, as path prefixes relative to the project root
 * (POSIX separators). A prefix ending in "/" matches a directory; otherwise an exact file.
 */
export const WRITE_SCOPES = {
  'product-analyst': [
    'specs/',
    'docs/',
    '.github/ISSUE_TEMPLATE/',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'README.md',
  ],
  'test-engineer': [
    'tests/',
    'e2e/',
    'supabase/tests/',
    'scripts/test/',
    'playwright.config.ts',
    'vitest.config.ts',
    'vitest.workspace.ts',
    'specs/quality/traceability.md',
  ],
  'security-reviewer': ['docs/security/'],
};

/**
 * Decides whether an agent profile may write `filePath`.
 * @param {string} profile
 * @param {string} filePath absolute or project-relative path
 * @param {string} projectDir absolute project root
 * @param {string[]} [extraAllowedRoots] absolute roots always allowed (e.g. the OS temp dir)
 * @returns {Decision | null}
 */
export function evaluateWrite(profile, filePath, projectDir, extraAllowedRoots = []) {
  const scopes = WRITE_SCOPES[profile];
  if (!scopes) return { decision: 'deny', reason: `Profilo di scrittura sconosciuto: ${profile}.` };
  if (typeof filePath !== 'string' || filePath.length === 0) return null;

  const fold = (p) => (process.platform === 'win32' ? p.toLowerCase() : p);
  const absolute = path.resolve(projectDir, filePath);

  for (const root of extraAllowedRoots) {
    const rel = path.relative(fold(path.resolve(root)), fold(absolute));
    if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) return null;
  }

  const relative = path.relative(fold(path.resolve(projectDir)), fold(absolute)).split(path.sep).join('/');
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return { decision: 'deny', reason: `[${profile}] scrittura fuori dal progetto non consentita: ${filePath}` };
  }
  const allowed = scopes.some((scope) => (scope.endsWith('/') ? relative.startsWith(fold(scope)) : relative === fold(scope)));
  if (allowed) return null;
  return {
    decision: 'deny',
    reason: `[${profile}] può scrivere solo in: ${scopes.join(', ')}. Percorso rifiutato: ${relative}. Segnala la modifica necessaria all'orchestratore.`,
  };
}
