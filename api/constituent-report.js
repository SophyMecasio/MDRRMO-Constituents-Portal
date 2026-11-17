import { db } from "hatchable";

export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const body = req.body || {};
  if (typeof body.website === "string" && body.website.trim()) return res.status(400).json({ error: "Invalid submission." });
  if (body.consent !== true) return res.status(400).json({ error: "Please confirm the information-use notice before submitting." });
  const reporter_name = typeof body.reporter_name === "string" ? body.reporter_name.trim() : "";
  const contact_number = typeof body.contact_number === "string" ? body.contact_number.trim() : "";
  const barangay = typeof body.barangay === "string" ? body.barangay.trim() : "";
  const incident_type = typeof body.incident_type === "string" ? body.incident_type.trim() : "";
  const incident_location = typeof body.incident_location === "string" ? body.incident_location.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!reporter_name || !contact_number || !barangay || !incident_type || !incident_location || !description) {
    return res.status(400).json({ error: "Please complete all required fields." });
  }
  if (reporter_name.length > 120 || contact_number.length > 40 || barangay.length > 120 || incident_type.length > 80 || incident_location.length > 240 || description.length > 3000) {
    return res.status(400).json({ error: "One or more fields exceed the allowed length." });
  }

  const saved = await db.query(
    "INSERT INTO constituent_reports (reporter_name, contact_number, barangay, incident_type, incident_location, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at",
    [reporter_name, contact_number, barangay, incident_type, incident_location, description]
  );
  res.status(201).json({ message: "Your report has been submitted to the portal. This form is not an emergency dispatch service.", report_id: saved.rows[0].id, created_at: saved.rows[0].created_at });
}