#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# run-tests-compose.sh
# Run the Origin Automation tests using Docker Compose.
# Outputs (downloads/, playwright-report/, test-results/) are mounted back
# to the host via the volumes defined in docker-compose.yml.
# ---------------------------------------------------------------------------
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "▶ Building and running tests via Docker Compose..."
docker compose \
  -f "${PROJECT_DIR}/docker-compose.yml" \
  up --build --abort-on-container-exit

EXIT_CODE=$(
  docker compose \
    -f "${PROJECT_DIR}/docker-compose.yml" \
    ps -a --format json 2>/dev/null \
  | python3 -c "
import sys, json
data = sys.stdin.read().strip()
# compose ps --format json can return one object per line or a JSON array
rows = []
for line in data.splitlines():
    try: rows.append(json.loads(line))
    except: pass
for r in rows:
    name = r.get('Name', r.get('Service', ''))
    if 'playwright' in name.lower():
        print(r.get('ExitCode', r.get('State', {}).get('ExitCode', 0)))
        break
else:
    print(0)
" 2>/dev/null || echo "0"
)

docker compose \
  -f "${PROJECT_DIR}/docker-compose.yml" \
  down --remove-orphans

echo ""
if [ "${EXIT_CODE}" -eq 0 ]; then
  echo "✅ All tests passed."
else
  echo "❌ Tests failed (exit code ${EXIT_CODE})."
  echo "   Open playwright-report/index.html to review the HTML report."
fi

exit "${EXIT_CODE}"
