CREATE TABLE IF NOT EXISTS page_views (
  id      BIGSERIAL PRIMARY KEY,
  ts      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  host    TEXT,
  path    TEXT NOT NULL,
  ua      TEXT,
  referer TEXT,
  ip      TEXT,
  status  SMALLINT,
  bytes   INT
);
CREATE INDEX ON page_views (ts DESC);
CREATE INDEX ON page_views (host);
CREATE INDEX ON page_views (ua);
CREATE INDEX ON page_views (path);
