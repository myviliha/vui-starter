#!/usr/bin/env node
// Create (or inspect) the VUI Pro product on Polar.
//
//   node scripts/polar-product.mjs                 # show the org and existing products
//   node scripts/polar-product.mjs --create        # create the product
//   node scripts/polar-product.mjs --create --price 14900 --name "VUI Pro"
//
// Reads POLAR_ACCESS_TOKEN and POLAR_ENVIRONMENT from .env at the repo root.
// That file is git-ignored; never move the token into .env.example, and never
// give it a NEXT_PUBLIC_ prefix, or it ships inside the static export.
//
// ponytail: plain fetch against the documented REST API, no SDK. Creating a
// product is a handful of fields; the SDK is 40 dependencies for one POST.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const arg = (f, fallback) => {
  const i = args.indexOf(f);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

// Minimal .env reader: KEY="value" or KEY=value, ignoring comments.
function readEnv(file) {
  const out = {};
  let raw = "";
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return out; // no .env yet — handled by the caller
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...readEnv(join(repo, ".env")), ...process.env };
const token = env.POLAR_ACCESS_TOKEN;
if (!token) {
  console.error(
    "polar: no POLAR_ACCESS_TOKEN.\n" +
      "  cp .env.example .env   then paste the token into .env (never .env.example)",
  );
  process.exit(1);
}

// Sandbox and production are separate instances with separate tokens, so a
// production token fails against sandbox and vice versa.
const sandbox = (env.POLAR_ENVIRONMENT ?? "sandbox") !== "production";
const API = sandbox ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";

async function polar(path, init = {}) {
  const res = await fetch(API + path, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...init.headers,
    },
  });
  const body = await res.text();
  let json;
  try {
    json = body ? JSON.parse(body) : null;
  } catch {
    json = { raw: body };
  }
  if (!res.ok) {
    // Never echo the request headers here; they carry the token.
    throw new Error(`${init.method ?? "GET"} ${path} → ${res.status}\n${JSON.stringify(json, null, 2)}`);
  }
  return json;
}

const PRODUCT = {
  name: arg("--name", "VUI Pro"),
  description: arg(
    "--description",
    "Premium blocks and framework components built on top of VUI. The core library stays MIT and free; Pro is net-new work: premium blocks (billing, roles and permissions, audit log, inbox), datatable and record forms for Vue and Svelte, priority on bug reports, and a commercial license with an invoice.",
  ),
  // Cents. 14900 = $149.00, matching PRO.price in apps/backoffice/lib/app-config.ts.
  price: Number(arg("--price", "14900")),
  // draft   = exists, nobody can reach it (what you want before Pro is built)
  // private = reachable by direct link, not listed
  // public  = on sale
  visibility: arg("--visibility", "draft"),
};

async function main() {
  console.log(`polar: ${sandbox ? "SANDBOX" : "PRODUCTION"} (${API})\n`);

  const orgs = await polar("/v1/organizations/?limit=10");
  const items = orgs.items ?? [];
  if (!items.length) {
    console.error("polar: this token can't see any organization. Wrong environment?");
    process.exit(1);
  }
  for (const o of items) console.log(`  org  ${o.name}  (${o.slug})  ${o.id}`);
  const org = items[0];

  const products = await polar(`/v1/products/?organization_id=${org.id}&limit=50`);
  const existing = products.items ?? [];
  console.log(`\n  ${existing.length} product(s) in ${org.slug}:`);
  for (const p of existing) {
    const price = p.prices?.[0];
    const amount = price?.price_amount != null ? `$${(price.price_amount / 100).toFixed(2)}` : "—";
    // draft and private are not on sale; say so rather than implying "live".
    const state = p.is_archived ? "archived" : (p.visibility ?? "unknown");
    console.log(`  ${state.padEnd(8)}  ${amount.padStart(8)}  ${p.name}  ${p.id}`);
  }

  const clash = existing.find((p) => p.name === PRODUCT.name && !p.is_archived);
  if (clash) {
    console.log(`\npolar: "${PRODUCT.name}" already exists (${clash.id}). Nothing to do.`);
    console.log(`Checkout link: https://polar.sh/${org.slug}/${clash.id}`);
    return;
  }

  console.log(
    `\nWould create:\n  name        ${PRODUCT.name}\n  price       $${(PRODUCT.price / 100).toFixed(2)} USD, one-time\n  visibility  ${PRODUCT.visibility}\n  org         ${org.slug}`,
  );
  if (!has("--create")) {
    console.log("\nDry run. Re-run with --create to actually create it.");
    return;
  }

  const created = await polar("/v1/products/", {
    method: "POST",
    body: JSON.stringify({
      name: PRODUCT.name,
      description: PRODUCT.description,
      // An organization token (polar_oat_) already names the organization, and
      // Polar rejects the field outright. A personal token (polar_pat_) can
      // reach several organizations, so it has to say which.
      ...(token.startsWith("polar_oat_") ? {} : { organization_id: org.id }),
      visibility: PRODUCT.visibility,
      recurring_interval: null, // one-time purchase
      prices: [
        { amount_type: "fixed", price_amount: PRODUCT.price, price_currency: "usd" },
      ],
    }),
  });

  console.log(`\nCreated ${created.name} (${created.id})`);
  console.log("\nNext:");
  console.log("  1. In Polar, add the GitHub Repository Access benefit pointing at the private Pro repo.");
  console.log("  2. Copy the checkout link into NEXT_PUBLIC_PRO_CHECKOUT_URL (apps/backoffice/.env.local).");
  console.log("  3. Flip PRO.available to true in apps/backoffice/lib/app-config.ts.");
}

main().catch((err) => {
  console.error(`polar: ${err.message}`);
  process.exit(1);
});
