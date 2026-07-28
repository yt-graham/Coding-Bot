const { sql, CONFIG_PATTERN } = require("../lib/db");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const config = typeof req.query.config === "string" ? req.query.config : "";
  const range = req.query.range === "today" ? "today" : "alltime";

  if (!CONFIG_PATTERN.test(config)) {
    res.status(400).json({ error: "Invalid config" });
    return;
  }

  try {
    const rows = range === "today"
      ? await sql`
          select id, time_seconds as time, name, created_at as ts
          from scores
          where config = ${config} and created_at >= date_trunc('day', now())
          order by time_seconds asc
          limit 10
        `
      : await sql`
          select id, time_seconds as time, name, created_at as ts
          from scores
          where config = ${config}
          order by time_seconds asc
          limit 10
        `;
    res.status(200).json({ scores: rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
};
