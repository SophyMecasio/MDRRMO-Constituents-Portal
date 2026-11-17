import { db } from "hatchable";

export const access = "admin";
export const methods = ["GET", "POST"];

export default async function (req, res) {
  if (req.method === "GET") {
    const reports = await db.query("SELECT id, reporter_name, contact_number, barangay, incident_type, incident_location, description, status, created_at FROM constituent_reports ORDER BY created_at DESC LIMIT 100");
    const advisories = await db.query("SELECT id, title, category, severity, body, is_published, created_at FROM public_advisories ORDER BY created_at DESC LIMIT 100");
    const centers = await db.query("SELECT id, center_name, barangay, address, capacity, contact_number, status FROM evacuation_centers ORDER BY center_name ASC");
    res.json({ reports: reports.rows, advisories: advisories.rows, evacuation_centers: centers.rows });
    return;
  }

  const body = req.body || {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "General";
  const severity = typeof body.severity === "string" ? body.severity.trim() : "Information";
  const message = typeof body.body === "string" ? body.body.trim() : "";
  if (!title || !message) return res.status(400).json({ error: "Title and announcement details are required." });
  if (title.length > 180 || category.length > 80 || severity.length > 40 || message.length > 4000) return res.status(400).json({ error: "One or more fields exceed the allowed length." });

  const saved = await db.query(
    "INSERT INTO public_advisories (title, category, severity, body, is_published) VALUES ($1, $2, $3, $4, true) RETURNING id",
    [title, category || "General", severity || "Information", message]
  );
  res.status(201).json({ message: "Advisory published.", id: saved.rows[0].id });
}