#!/usr/bin/env node
// PreToolUse hook (Bash | PowerShell): denies or escalates commands that the project
// mandate reserves for explicit human approval. Rules live in ./lib/rules.mjs.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { evaluateCommand } from './lib/rules.mjs';

function currentBranch(cwd) {
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // Malformed input: defer to the normal permission flow.
}

const command = input?.tool_input?.command;
if (typeof command === 'string' && command.length > 0) {
  const result = evaluateCommand(command, { branch: currentBranch(input.cwd || process.cwd()) });
  if (result) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: result.decision,
          permissionDecisionReason: `[guard-commands] ${result.reason}`,
        },
      }),
    );
  }
}
