const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.hkhxrwydrljsnnsooedu',
  password: 'pSrJdSH7UqAHNCfe',
  ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
  await client.connect();
  console.log('✅ Conectado a PostgreSQL');
  
  // Migration 1: _migrations table
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅ _migrations table created');
  
  // Migration 2: users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(10) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
      theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
      budget_monthly DECIMAL(10,2),
      notifications_enabled BOOLEAN DEFAULT true,
      is_active BOOLEAN DEFAULT true,
      last_login_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅ users table created');
  
  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  await client.query(`
    INSERT INTO users (id, name, email, password_hash, role, theme, notifications_enabled, is_active, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (id) DO UPDATE SET password_hash = $4;
  `, [
    '550e8400-e29b-41d4-a716-446655440000',
    'Admin CampusZen',
    'admin@campuszen.com',
    passwordHash,
    'admin',
    'light',
    true,
    true
  ]);
  console.log('✅ Admin user created');
  console.log('   Email: admin@campuszen.com');
  console.log('   Password: admin123');
  
  await client.end();
  console.log('✅ Migraciones completadas');
}

runMigrations().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
