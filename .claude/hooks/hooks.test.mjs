// Tests for the Claude Code guard hooks. Run: node --test ".claude/hooks/*.test.mjs"
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { evaluateCommand, evaluateWrite } from './lib/rules.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(here, '..', '..');

describe('evaluateCommand', () => {
  const denied = [
    'gh pr merge 12 --squash',
    'git push --force origin feat/2-setup',
    'git push -f',
    'git push origin main',
    'git push origin HEAD:main',
    'git commit -m "x" --no-verify',
    'supabase db reset --linked',
    'npx supabase db reset --db-url postgres://x',
    'vercel deploy --prod',
    'npx vercel promote https://x.vercel.app',
    'gh api -X PUT repos/o/r/branches/main/protection',
    'gh api repos/o/r/rulesets --method POST -f name=x',
    'rm -rf /',
    'rm -rf ~',
  ];
  for (const command of denied) {
    it(`denies: ${command}`, () => {
      assert.equal(evaluateCommand(command, { branch: 'feat/2-setup' })?.decision, 'deny');
    });
  }

  const asked = [
    'git push --force-with-lease origin feat/2-setup',
    'npx supabase db push',
    'supabase link --project-ref abc',
    'supabase migration list --linked',
    'gh secret set RESEND_API_KEY',
    'vercel deploy',
    'git reset --hard HEAD~1',
    'git clean -fdx',
  ];
  for (const command of asked) {
    it(`asks: ${command}`, () => {
      assert.equal(evaluateCommand(command, { branch: 'feat/2-setup' })?.decision, 'ask');
    });
  }

  const allowed = [
    'git push -u origin chore/1-bootstrap',
    'git push origin feat/12-main-menu',
    'git push --follow-tags origin feat/2-setup',
    'git commit -m "feat: add lock rpc (#12)"',
    'npx supabase db reset',
    'npx supabase start',
    'npm run verify',
    'gh pr create --draft',
    'gh api repos/o/r/branches/main/protection',
    'rm -rf node_modules',
    'rm -rf /tmp/build',
  ];
  for (const command of allowed) {
    it(`allows: ${command}`, () => {
      assert.equal(evaluateCommand(command, { branch: 'feat/2-setup' }), null);
    });
  }

  it('denies commits and bare pushes on main', () => {
    assert.equal(evaluateCommand('git commit -m "x"', { branch: 'main' })?.decision, 'deny');
    assert.equal(evaluateCommand('git push', { branch: 'main' })?.decision, 'deny');
    assert.equal(evaluateCommand('git push -u origin', { branch: 'main' })?.decision, 'deny');
    assert.equal(evaluateCommand('git push origin feat/2-x', { branch: 'main' }), null);
  });
});

describe('evaluateWrite', () => {
  const at = (p) => path.join(projectDir, p);

  it('lets the product analyst write specs and templates only', () => {
    assert.equal(evaluateWrite('product-analyst', at('specs/features/F-001-tenancy.md'), projectDir), null);
    assert.equal(evaluateWrite('product-analyst', at('.github/PULL_REQUEST_TEMPLATE.md'), projectDir), null);
    assert.equal(evaluateWrite('product-analyst', at('src/app/page.tsx'), projectDir)?.decision, 'deny');
    assert.equal(evaluateWrite('product-analyst', at('.github/workflows/ci.yml'), projectDir)?.decision, 'deny');
  });

  it('keeps the test engineer out of production code', () => {
    assert.equal(evaluateWrite('test-engineer', at('e2e/lock.spec.ts'), projectDir), null);
    assert.equal(evaluateWrite('test-engineer', at('supabase/tests/rls_editions.test.sql'), projectDir), null);
    assert.equal(evaluateWrite('test-engineer', at('playwright.config.ts'), projectDir), null);
    assert.equal(evaluateWrite('test-engineer', at('src/domains/locking/lock.ts'), projectDir)?.decision, 'deny');
    assert.equal(evaluateWrite('test-engineer', at('supabase/migrations/0001_init.sql'), projectDir)?.decision, 'deny');
  });

  it('confines the security reviewer to its reports', () => {
    assert.equal(evaluateWrite('security-reviewer', at('docs/security/reviews/2026-10-25-pr-18.md'), projectDir), null);
    assert.equal(evaluateWrite('security-reviewer', at('specs/architecture/security-model.md'), projectDir)?.decision, 'deny');
  });

  it('rejects paths escaping the project, but allows extra roots', () => {
    const outside = path.resolve(projectDir, '..', 'elsewhere.md');
    assert.equal(evaluateWrite('product-analyst', outside, projectDir)?.decision, 'deny');
    assert.equal(evaluateWrite('product-analyst', at('specs/../src/x.ts'), projectDir)?.decision, 'deny');
    assert.equal(evaluateWrite('product-analyst', path.join(os.tmpdir(), 'draft.md'), projectDir, [os.tmpdir()]), null);
  });

  it('rejects unknown profiles', () => {
    assert.equal(evaluateWrite('nobody', at('specs/x.md'), projectDir)?.decision, 'deny');
  });
});

describe('hook entry points', () => {
  const run = (script, args, payload) =>
    spawnSync(process.execPath, [path.join(here, script), ...args], {
      input: JSON.stringify(payload),
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    });

  it('guard-commands emits a deny decision as JSON', () => {
    const res = run('guard-commands.mjs', [], { cwd: projectDir, tool_input: { command: 'gh pr merge 1' } });
    assert.equal(res.status, 0);
    assert.equal(JSON.parse(res.stdout).hookSpecificOutput.permissionDecision, 'deny');
  });

  it('guard-commands stays silent for ordinary commands', () => {
    const res = run('guard-commands.mjs', [], { cwd: projectDir, tool_input: { command: 'git status' } });
    assert.equal(res.status, 0);
    assert.equal(res.stdout, '');
  });

  it('guard-paths blocks with exit code 2 and allows in scope', () => {
    const blocked = run('guard-paths.mjs', ['security-reviewer'], { tool_input: { file_path: path.join(projectDir, 'src', 'x.ts') } });
    assert.equal(blocked.status, 2);
    assert.match(blocked.stderr, /security-reviewer/);
    const ok = run('guard-paths.mjs', ['security-reviewer'], { tool_input: { file_path: path.join(projectDir, 'docs', 'security', 'reviews', 'r.md') } });
    assert.equal(ok.status, 0);
  });
});
