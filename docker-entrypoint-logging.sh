#!/bin/sh
set -e
if [ -n "$LOG_HOST" ]; then
  cp /etc/nginx/logging.conf.available /etc/nginx/conf.d/logging.conf
  fluent-bit -c /etc/fluent-bit/fluent-bit.conf &
  echo "Log forwarding enabled → $LOG_HOST"
fi
exec /docker-entrypoint.sh "$@"
