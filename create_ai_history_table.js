require('dotenv').config();
const db = require('./src/config/db');

async function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS ai_search_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      travel_request TEXT NOT NULL,
      parsed_data JSONB,
      recommendations JSONB,
      model_version VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await db.query(sql);
  console.log('Table ai_search_history created successfully');
  process.exit(0);
}

createTable().catch(e => { console.error(e.message); process.exit(1); });
