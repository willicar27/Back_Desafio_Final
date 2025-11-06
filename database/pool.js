import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'williamc',
  database: 'libreria',
  port: 5432,
  allowExitOnIdle: true,
});

export { pool };