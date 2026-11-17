CREATE TABLE public_advisories (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  severity TEXT NOT NULL DEFAULT 'Information',
  body TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_public_advisories_created ON public_advisories(created_at DESC);