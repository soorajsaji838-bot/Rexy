#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p pwd
PROJECT_DIR="$(pwd)"
DIST_DIR="$PROJECT_DIR/dist"
PORT="${PORT:-3000}"
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
/usr/bin/time -p mkdir -p "$DIST_DIR" "$WEB_DIR"
/usr/bin/time -p test -f "$DIST_DIR/index.html"
/usr/bin/time -p ls -la "$DIST_DIR"
if /usr/bin/time -p test -f "$PROJECT_DIR/package.json"; then
  /usr/bin/time -p npm --prefix "$PROJECT_DIR" install --no-audit --no-fund
  /usr/bin/time -p npm --prefix "$PROJECT_DIR" run build --if-present
fi
/usr/bin/time -p test -f "$DIST_DIR/index.html"
/usr/bin/time -p python3 -c "import json,os; d=os.environ; open(os.path.join(d.get('OPENCODE_WEB_DIR','/home/runner/work/_temp/omgithub-web'),'deployment-output.json'),'w').write(json.dumps({'project':'$PROJECT_DIR','directory':'$DIST_DIR'}))"
/usr/bin/time -p cat "$WEB_DIR/deployment-output.json"
exec /usr/bin/time -p python3 -m http.server "$PORT" --directory "$DIST_DIR" --bind 0.0.0.0
