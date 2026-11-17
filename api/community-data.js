import { db } from "hatchable";

export const access = "public";
export const methods = ["GET"];

export default async function (req, res) {
  const advisories = await db.query(
    "SELECT id, title, category, severity, body, created_at FROM public_advisories WHERE is_published = true ORDER BY created_at DESC LIMIT 20"
  );
  const centers = await db.query(
    "SELECT id, center_name, barangay, address, capacity, contact_number, status FROM evacuation_centers ORDER BY center_name ASC"
  );
  res.json({ advisories: advisories.rows, evacuation_centers: centers.rows });
}