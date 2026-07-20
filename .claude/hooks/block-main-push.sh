#!/usr/bin/env bash
# Block pushes to the protected `main` branch — enforce the branch + PR flow
# (see AGENTS.md). Fires as a PreToolUse hook on Bash; exit 2 blocks the call.
input=$(cat)
cmd=$(printf '%s' "$input" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null)

# Only inspect real `git push` invocations — `push` must be git's subcommand at a
# command boundary (start, or after ; && || |). This ignores the string "git push"
# when it merely appears inside a commit message or other quoted argument.
if ! printf '%s' "$cmd" | grep -Eq '(^|[;&|])[[:space:]]*git[[:space:]]+push([[:space:]]|$)'; then
  exit 0
fi

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

# Block when main is the explicit target (`... main`, `HEAD:main`, `:main`)
# or when pushing the current branch while it IS main.
if printf '%s' "$cmd" | grep -Eq '(:| )main([[:space:]]|$)' || [ "$branch" = "main" ]; then
  echo "Blocked: pushing to 'main' is disabled. Branch off main and open a PR (see AGENTS.md)." >&2
  exit 2
fi
exit 0
