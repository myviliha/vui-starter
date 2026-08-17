#!/usr/bin/env node
// Hash a docs password for NEXT_PUBLIC_DOCS_PASSWORD_HASH.
//
//     pnpm --filter backoffice docs-password            # prompts, input hidden
//     pnpm --filter backoffice docs-password 'hunter2'  # non-interactive (CI)
//
// Prints the encoded argon2id hash, which carries its own salt and cost
// parameters. Paste the line into .env.local next to NEXT_PUBLIC_DOCS_EMAIL.
//
// The `$` signs come out escaped as `\$` on purpose: Next loads .env through
// dotenv-expand, which reads an unescaped `$argon2id` as a variable reference
// and expands it to nothing. Escaping is the only form that survives; quoting
// is not enough.

import { createInterface } from "node:readline/promises";
import { stdin, stdout, argv, exit } from "node:process";
import { randomBytes } from "node:crypto";

import { argon2id, argon2Verify } from "hash-wasm";
import assert from "node:assert/strict";

// OWASP's argon2id baseline: 19 MiB of memory, 2 passes, 1 lane. The check runs
// in a browser tab here, so memory stays modest on purpose.
const PARAMS = { parallelism: 1, iterations: 2, memorySize: 19456, hashLength: 32 };

/** `--selftest`: what this script writes is what lib/docs-auth.ts accepts.
 *  Run it if you ever touch the parameters above. */
async function selftest() {
  const hash = await encode("correct-horse-battery");
  assert.equal(await argon2Verify({ password: "correct-horse-battery", hash }), true);
  assert.equal(await argon2Verify({ password: "wrong", hash }), false);
  assert.match(hash, /^\$argon2id\$/);
  console.log("ok — argon2id hash verifies, wrong password rejected");
}

/** The encoded argon2id hash of `password`, salt and parameters included. */
function encode(password) {
  return argon2id({
    password,
    salt: randomBytes(16),
    outputType: "encoded",
    ...PARAMS,
  });
}

async function readPassword() {
  const fromArgs = argv[2];
  if (fromArgs) return fromArgs;
  if (!stdin.isTTY) {
    console.error("No password given and no terminal to prompt on.");
    exit(1);
  }
  const rl = createInterface({ input: stdin, output: stdout, terminal: true });
  // Mute the echo so the password never lands in the scrollback.
  const write = stdout.write.bind(stdout);
  rl.output.write = (chunk, ...rest) =>
    rl.stdoutMuted ? true : write(chunk, ...rest);
  const answer = rl.question("Docs password: ");
  rl.stdoutMuted = true;
  const password = await answer;
  rl.stdoutMuted = false;
  rl.close();
  write("\n");
  return password;
}

if (argv[2] === "--selftest") {
  await selftest();
  exit(0);
}

const password = await readPassword();
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  exit(1);
}

const hash = await encode(password);
console.log(`\nNEXT_PUBLIC_DOCS_PASSWORD_HASH="${hash.replaceAll("$", "\\$")}"\n`);
