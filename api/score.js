const { sql, CONFIG_PATTERN, sanitizeName } = require("../lib/db");

async function handlePost(req, res) {
  const body = req.body || {};
  const config = body.config;
  const time = body.time;

  if (typeof config !== "string" || !CONFIG_PATTERN.test(config)) {
    res.status(400).json({ error: "Invalid config" });
    return;
  }
  if (!Number.isInteger(time) || time < 0 || time > 999) {
    res.status(400).json({ error: "Invalid time" });
    return;
  }

  try {
    const rows = await sql`
      insert into scores (config, time_seconds, name)
      values (${config}, ${time}, ${sanitizeName(body.name)})
      returning id, time_seconds as time, name, created_at as ts
    `;
    const rankRows = await sql`
      select count(*)::int as cnt from scores where config = ${config} and time_seconds < ${time}
    `;
    res.status(201).json({ score: rows[0], rank: rankRows[0].cnt + 1 });
  } catch (err) {
    res.status(500).json({ error: "Failed to save score" });
  }
}

async function handlePatch(req, res) {
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!/^\d+$/.test(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const name = sanitizeName((req.body || {}).name);

  try {
    const rows = await sql`
      update scores set name = ${name} where id = ${id}
      returning id, time_seconds as time, name, created_at as ts
    `;
    if (!rows.length) {
      res.status(404).json({ error: "Score not found" });
      return;
    }
    res.status(200).json({ score: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to update score" });
  }
}

module.exports = async function handler(req, res) {
  if (req.method === "POST") return handlePost(req, res);
  if (req.method === "PATCH") return handlePatch(req, res);
  res.status(405).json({ error: "Method not allowed" });
};
