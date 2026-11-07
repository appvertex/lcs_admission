CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  parent_user_id TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  class_applied TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('new', 'transfer')),
  previous_school TEXT,
  aadhaar_last4 TEXT,
  address TEXT NOT NULL,
  religion TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Visit scheduled', 'Admitted', 'Closed'))
);
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries(status);

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
