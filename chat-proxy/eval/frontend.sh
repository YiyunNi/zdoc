#!/usr/bin/env bash
#
# Frontend Evaluation Script (playwright-cli)
# Automates admin dashboard testing via browser automation.
#
# Usage:
#   export CHAT_PROXY_URL="http://localhost:8787"
#   ./eval/frontend.sh
#
# Requires: playwright-cli (npm install -g playwright-cli)
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="/Volumes/CaseSensitive/projects/zdoc-redesign/.env"

# ---------------------------------------------------------------------------
# Load credentials
# ---------------------------------------------------------------------------
if [[ -f "$ENV_FILE" ]]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

URL="${CHAT_PROXY_URL:-http://localhost:8787}"
ADMIN_KEY="${ADMIN_API_KEY:-}"

if [[ -z "$ADMIN_KEY" ]]; then
  echo "❌ ADMIN_API_KEY not found in .env"
  exit 1
fi

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

TOTAL=0
PASSED=0
FAILED=0

pass() {
  echo "  ✅ PASS: $1"
  PASSED=$((PASSED + 1))
  TOTAL=$((TOTAL + 1))
}

fail() {
  echo "  ❌ FAIL: $1"
  FAILED=$((FAILED + 1))
  TOTAL=$((TOTAL + 1))
}

section() {
  echo ""
  echo "================================================================"
  echo "$1"
  echo "================================================================"
}

# Run a playwright-cli command, return 0 on success
pwc() {
  playwright-cli "$@" > /dev/null 2>&1
}

# ---------------------------------------------------------------------------
# 1. Login & Auth
# ---------------------------------------------------------------------------

section "1. Login & Auth"

playwright-cli open "$URL/admin/dashboard"
sleep 2

# Check login form exists
if playwright-cli eval "document.getElementById('loginCover') !== null" > /dev/null 2>&1; then
  pass "Login cover is visible before auth"
else
  fail "Login cover not found"
fi

# Enter API key and login
playwright-cli fill loginKey "$ADMIN_KEY"
playwright-cli click loginBtn
sleep 2

# Check app is visible after login
if playwright-cli eval "document.getElementById('app').classList.contains('hidden') === false" > /dev/null 2>&1; then
  pass "Dashboard visible after login"
else
  fail "Dashboard not visible after login"
fi

# Check user badge populated
if playwright-cli eval "document.getElementById('userBadgeName').textContent !== '—'" > /dev/null 2>&1; then
  pass "User badge populated after login"
else
  fail "User badge not populated"
fi

# ---------------------------------------------------------------------------
# 2. Dashboard Page
# ---------------------------------------------------------------------------

section "2. Dashboard Page"

# Wait for metrics to load
sleep 3

# Check metric strip populated
if playwright-cli eval "document.getElementById('mConversations').textContent !== '—'" > /dev/null 2>&1; then
  pass "Conversations metric loaded"
else
  fail "Conversations metric not loaded"
fi

if playwright-cli eval "document.getElementById('mMessages').textContent !== '—'" > /dev/null 2>&1; then
  pass "Messages metric loaded"
else
  fail "Messages metric not loaded"
fi

# Check charts exist
if playwright-cli eval "document.getElementById('chartConv') !== null" > /dev/null 2>&1; then
  pass "Conversations chart exists"
else
  fail "Conversations chart missing"
fi

if playwright-cli eval "document.getElementById('chartFeedback') !== null" > /dev/null 2>&1; then
  pass "Feedback chart exists"
else
  fail "Feedback chart missing"
fi

# Check live badge
if playwright-cli eval "document.getElementById('liveBadge') !== null" > /dev/null 2>&1; then
  pass "Live badge exists"
else
  fail "Live badge missing"
fi

# Check activity feed
if playwright-cli eval "document.getElementById('activityFeed').children.length > 0" > /dev/null 2>&1; then
  pass "Activity feed has entries"
else
  fail "Activity feed empty"
fi

# ---------------------------------------------------------------------------
# 3. Users & Sessions Page
# ---------------------------------------------------------------------------

section "3. Users & Sessions Page"

playwright-cli click "a[data-page='users']"
sleep 2

# Check page switch
if playwright-cli eval "document.getElementById('pageUsers').classList.contains('active')" > /dev/null 2>&1; then
  pass "Users page is active"
else
  fail "Users page not active"
fi

# Check user list loaded
if playwright-cli eval "document.getElementById('usersListBody').children.length > 0" > /dev/null 2>&1; then
  pass "User list loaded"
else
  fail "User list empty"
fi

# ---------------------------------------------------------------------------
# 4. Costs & Settings Page
# ---------------------------------------------------------------------------

section "4. Costs & Settings Page"

playwright-cli click "a[data-page='costs']"
sleep 2

# Check page switch
if playwright-cli eval "document.getElementById('pageCosts').classList.contains('active')" > /dev/null 2>&1; then
  pass "Costs page is active"
else
  fail "Costs page not active"
fi

# Switch to Settings tab
playwright-cli click "button[data-cs-tab='settings']"
sleep 2

# Check model config visible
if playwright-cli eval "document.getElementById('modelConfigBody').children.length > 0" > /dev/null 2>&1; then
  pass "Model config rows rendered"
else
  fail "Model config rows missing"
fi

# Check cache config visible
if playwright-cli eval "document.getElementById('cacheConfigBody').children.length > 0" > /dev/null 2>&1; then
  pass "Cache config rendered"
else
  fail "Cache config missing"
fi

# ---------------------------------------------------------------------------
# 5. Navigation & State
# ---------------------------------------------------------------------------

section "5. Navigation & State"

# Navigate back to dashboard
playwright-cli click "a[data-page='dashboard']"
sleep 1

if playwright-cli eval "document.getElementById('pageDashboard').classList.contains('active')" > /dev/null 2>&1; then
  pass "Dashboard re-selected successfully"
else
  fail "Dashboard not active after nav"
fi

# ---------------------------------------------------------------------------
# 6. Logout
# ---------------------------------------------------------------------------

section "6. Logout"

playwright-cli click signOutBtn
sleep 1

if playwright-cli eval "document.getElementById('loginCover').classList.contains('hidden') === false" > /dev/null 2>&1; then
  pass "Login cover shown after logout"
else
  fail "Login cover not shown after logout"
fi

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

playwright-cli close

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

section "Summary"
echo "Total:  $TOTAL"
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [[ "$FAILED" -eq 0 ]]; then
  echo ""
  echo "🎉 All frontend tests passed!"
  exit 0
else
  echo ""
  echo "⚠️  $FAILED test(s) failed."
  exit 1
fi
