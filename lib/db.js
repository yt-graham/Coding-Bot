const { neon } = require("@neondatabase/serverless");

let sqlClient = null;

function sql(strings, ...values) {
  if (!sqlClient) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    sqlClient = neon(process.env.DATABASE_URL);
  }
  return sqlClient(strings, ...values);
}

const CONFIG_PATTERN = /^\d{1,3}x\d{1,3}-\d{1,3}$/;

function sanitizeName(name) {
  if (typeof name !== "string") return null;
  const trimmed = name.trim().slice(0, 16);
  return trimmed.length ? trimmed : null;
}

module.exports = { sql, CONFIG_PATTERN, sanitizeName };
