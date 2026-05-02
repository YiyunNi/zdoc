#!/usr/bin/env bash
#
# Router Accuracy Evaluation Script
# Tests the intent router against the golden dataset.
# Parses SSE output to extract the agent routing decision.
#
# Usage:
#   export CHAT_PROXY_URL="http://localhost:8787"
#   ./eval/router-accuracy.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GOLDEN_FILE="$SCRIPT_DIR/router-golden.yml"
ENV_FILE="/Volumes/CaseSensitive/projects/zdoc-redesign/.env"

# ---------------------------------------------------------------------------
# Load credentials
# ---------------------------------------------------------------------------
if [[ -f "$ENV_FILE" ]]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

HOST="${CHAT_PROXY_URL:-http://localhost:8787}"

# ---------------------------------------------------------------------------
# Dependencies check
# ---------------------------------------------------------------------------
if ! command -v yq &> /dev/null; then
  echo "⚠️  yq not found. Installing via brew..."
  brew install yq 2>/dev/null || {
    echo "❌ Failed to install yq. Please install it manually: https://github.com/mikefarah/yq"
    exit 1
  }
fi

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

total=0
correct=0
incorrect=0

evaluate_query() {
  local query="$1"
  local expected_agent="$2"
  local expected_topics="$3"

  # SSE parse: extract the agent event
  local response
  # Use --max-time to abort early — the agent event is emitted near the start
  # of the SSE stream, so 8s is usually enough even under load.
  response=$(curl -s -N --max-time 45 -X POST "$HOST/chat" \
    -H "Content-Type: application/json" \
    -H "Origin: http://localhost:3000" \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"$query\"}]}" 2>/dev/null || true)

  # Extract agent from SSE event: event: agent\ndata: {"type":"..."}
  local actual_agent
  actual_agent=$(echo "$response" | grep -A1 "^event: agent$" | grep "^data:" | sed 's/.*"type":"\([^"]*\)".*/\1/' || echo "unknown")

  if [[ "$actual_agent" == "$expected_agent" ]]; then
    echo "  ✅ [${actual_agent}] $query"
    correct=$((correct + 1))
  else
    echo "  ❌ [${actual_agent} vs ${expected_agent}] $query"
    incorrect=$((incorrect + 1))
  fi
  total=$((total + 1))
}

# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

echo "================================================================"
echo "Router Accuracy Evaluation"
echo "Host: $HOST"
echo "Dataset: $GOLDEN_FILE"
echo "================================================================"
echo ""

# Parse YAML and evaluate each entry
queries=()
while IFS= read -r line; do
  queries+=("$line")
done < <(yq '.[].query' "$GOLDEN_FILE")

agents=()
while IFS= read -r line; do
  agents+=("$line")
done < <(yq '.[].expected_agent' "$GOLDEN_FILE")

topics=()
while IFS= read -r line; do
  topics+=("$line")
done < <(yq '.[].expected_topics | join(",")' "$GOLDEN_FILE")

len=${#queries[@]}
for ((i=0; i<len; i++)); do
  evaluate_query "${queries[$i]}" "${agents[$i]}" "${topics[$i]}"
done

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo ""
echo "================================================================"
echo "Summary"
echo "================================================================"
echo "Total:     $total"
echo "Correct:   $correct"
echo "Incorrect: $incorrect"

if [[ "$total" -gt 0 ]]; then
  accuracy=$(awk "BEGIN {printf \"%.1f\", ($correct/$total)*100}")
  echo "Accuracy:  ${accuracy}%"
fi

if [[ "$incorrect" -eq 0 ]]; then
  echo ""
  echo "🎉 Perfect score! All queries routed correctly."
  exit 0
else
  echo ""
  echo "⚠️  $incorrect queries misrouted."
  exit 1
fi
