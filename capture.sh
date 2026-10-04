#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p pwd
if [[ -z "${CAPTURE_URL:-}" ]]; then echo 'CAPTURE_URL is required.' >&2; exit 1; fi
if [[ -z "${CAPTURE_DIR:-}" ]]; then echo 'CAPTURE_DIR is required.' >&2; exit 1; fi
if [[ -z "${RUNTIME_DIR:-}" ]]; then echo 'RUNTIME_DIR is required.' >&2; exit 1; fi
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
set +e
/usr/bin/time -p node "$RUNTIME_DIR/scripts/default-capture.mjs"
status=$?
set -e
if [[ $status -ne 0 ]]; then exit $status; fi
/usr/bin/time -p test -s "$CAPTURE_DIR/final-desktop.png"
/usr/bin/time -p test -s "$CAPTURE_DIR/final-mobile.png"
/usr/bin/time -p ls -la "$CAPTURE_DIR"
