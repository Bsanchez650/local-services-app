const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'local_services_app',
  password: '6500', // Replace with your postgres password
  port: 5432,
});

module.exports = pool;