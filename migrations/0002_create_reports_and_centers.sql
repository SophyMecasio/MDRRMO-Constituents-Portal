CREATE TABLE constituent_reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  barangay TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  incident_location TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Received',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX idx_constituent_reports_created ON constituent_reports(created_at DESC);
CREATE TABLE evacuation_centers (
  id BIGSERIAL PRIMARY KEY,
  center_name TEXT NOT NULL,
  barangay TEXT NOT NULL,
  address TEXT NOT NULL,
  capacity INTEGER,
  contact_number TEXT,
  status TEXT NOT NULL DEFAULT 'For verification',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);