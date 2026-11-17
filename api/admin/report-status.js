import { db } from "hatchable";

export const access = "admin";
export const methods = ["PUT"];

export default async function (req, res) {
  const id = Number(req.body?.id);
  const status = typeof req.body?.status === "string" ? req.body.status : "";
  const allowed = ["Received", "Under Review", "Referred", "Resolved"];
  if (!Number.isInteger(id) || id < 1 || !allowed.includes(status)) {
    return res.status(400).json({ error: "A valid report ID and status are required." });
  }
  const updated = await db.query(
    "UPDATE constituent_reports SET status = $1 WHERE id = $2 RETURNING id, status",
    [status, id]
  );
  if (!updated.rows.length) return res.status(404).json({ error: "Report not found." });
  res.json({ report: updated.rows[0] });
}