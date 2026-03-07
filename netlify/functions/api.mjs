import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';

const databaseUrl = process.env.NEON_DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const SESSION_DURATION_DAYS = 14;
const ADMIN_EMAIL = 'bonobo.des.alpes@gmail.com';
const ADMIN_PASSWORD = 'zboubus85!';

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

function toAppUser(row) {
  return {
    userId: row.user_id,
    username: row.username,
    email: row.email,
    password: row.password,
    cart: JSON.stringify(row.cart || []),
    wishlist: JSON.stringify(row.wishlist || []),
    purchaseHistory: JSON.stringify(row.purchase_history || []),
    createdAt: row.created_at
  };
}

function getAction(event) {
  const queryAction = event.queryStringParameters?.action;
  if (queryAction) return queryAction;

  const parts = (event.path || '').split('/').filter(Boolean);
  const apiIndex = parts.indexOf('api');
  if (apiIndex >= 0 && parts[apiIndex + 1]) {
    return parts[apiIndex + 1];
  }
  return '';
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

function makeSessionToken() {
  return `sess_${crypto.randomUUID()}_${crypto.randomBytes(12).toString('hex')}`;
}

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      cart JSONB NOT NULL DEFAULT '[]'::jsonb,
      wishlist JSONB NOT NULL DEFAULT '[]'::jsonb,
      purchase_history JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_logs (
      id BIGSERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      identifier TEXT NOT NULL,
      success BOOLEAN NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      session_token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

async function ensureAdminAccount() {
  await sql`
    INSERT INTO users (user_id, username, email, password, cart, wishlist, purchase_history)
    VALUES (
      'user_admin_bonobo',
      'bonobo_admin',
      ${ADMIN_EMAIL},
      ${ADMIN_PASSWORD},
      '[]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb
    )
    ON CONFLICT (email)
    DO UPDATE SET
      password = EXCLUDED.password,
      username = EXCLUDED.username;
  `;
}

async function logAuth(type, identifier, success) {
  await sql`
    INSERT INTO auth_logs (type, identifier, success)
    VALUES (${type}, ${identifier}, ${success});
  `;
}

async function createSession(userId) {
  const sessionToken = makeSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await sql`
    INSERT INTO sessions (session_token, user_id, expires_at)
    VALUES (
      ${sessionToken},
      ${userId},
      ${expiresAt}::timestamptz
    );
  `;
  return sessionToken;
}

async function getUserBySession(sessionToken) {
  if (!sessionToken) return null;
  const rows = await sql`
    SELECT u.*
    FROM sessions s
    JOIN users u ON u.user_id = s.user_id
    WHERE s.session_token = ${sessionToken}
      AND s.expires_at > NOW()
    LIMIT 1;
  `;
  return rows[0] || null;
}

function isAdminUser(user) {
  return !!user && user.email === ADMIN_EMAIL && user.password === ADMIN_PASSWORD;
}

async function requireAdminBySession(sessionToken) {
  const user = await getUserBySession(sessionToken);
  if (!isAdminUser(user)) return null;
  return user;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: jsonHeaders };
  }

  try {
    if (!sql) {
      return response(500, { error: 'missing_database_url' });
    }

    await ensureSchema();
    await ensureAdminAccount();

    const action = getAction(event);
    const body = parseBody(event);

    if (event.httpMethod === 'POST' && action === 'register') {
      const { username, email, password } = body;
      if (!username || !email || !password) {
        return response(400, { error: 'missing' });
      }

      const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      try {
        const created = await sql`
          INSERT INTO users (user_id, username, email, password)
          VALUES (${userId}, ${username}, ${email}, ${password})
          RETURNING *;
        `;

        await logAuth('register', email, true);
        const sessionToken = await createSession(userId);
        return response(200, { user: toAppUser(created[0]), sessionToken });
      } catch (e) {
        await logAuth('register', email, false);
        if (String(e?.message || '').toLowerCase().includes('unique')) {
          return response(409, { error: 'email_in_use' });
        }
        throw e;
      }
    }

    if (event.httpMethod === 'POST' && action === 'login') {
      const { identifier, password } = body;
      if (!identifier || !password) {
        return response(400, { error: 'missing' });
      }

      const usersByIdentifier = await sql`
        SELECT *
        FROM users
        WHERE email = ${identifier} OR username = ${identifier}
        LIMIT 1;
      `;

      const user = usersByIdentifier[0];
      if (!user) {
        await logAuth('login', identifier, false);
        return response(401, { error: 'no_account' });
      }

      if (user.password !== password) {
        await logAuth('login', identifier, false);
        return response(401, { error: 'invalid' });
      }

      await logAuth('login', identifier, true);
      const sessionToken = await createSession(user.user_id);
      return response(200, { user: toAppUser(user), sessionToken });
    }

    if (event.httpMethod === 'GET' && action === 'session') {
      const token = event.queryStringParameters?.token || '';
      const user = await getUserBySession(token);
      if (!user) return response(401, { error: 'invalid_session' });
      return response(200, { user: toAppUser(user) });
    }

    if (event.httpMethod === 'POST' && action === 'logout') {
      const { sessionToken } = body;
      if (sessionToken) {
        await sql`DELETE FROM sessions WHERE session_token = ${sessionToken};`;
      }
      return response(200, { success: true });
    }

    if (event.httpMethod === 'POST' && action === 'cart') {
      const { userId, cart, sessionToken } = body;
      let resolvedUserId = userId;

      if (!resolvedUserId && sessionToken) {
        const rows = await sql`
          SELECT user_id
          FROM sessions
          WHERE session_token = ${sessionToken}
            AND expires_at > NOW()
          LIMIT 1;
        `;
        resolvedUserId = rows[0]?.user_id;
      }

      if (!resolvedUserId) {
        return response(400, { error: 'missing_user' });
      }

      await sql`
        UPDATE users
        SET cart = ${JSON.stringify(cart || [])}::jsonb
        WHERE user_id = ${resolvedUserId};
      `;

      return response(200, { success: true });
    }

    if (event.httpMethod === 'GET' && action === 'users') {
      const rows = await sql`
        SELECT *
        FROM users
        ORDER BY created_at DESC;
      `;
      return response(200, rows.map(toAppUser));
    }

    if (event.httpMethod === 'GET' && action === 'auth-logs') {
      const logs = await sql`
        SELECT type, identifier, success, timestamp
        FROM auth_logs
        ORDER BY timestamp DESC
        LIMIT 1000;
      `;
      return response(200, { logs });
    }

    if (event.httpMethod === 'GET' && action === 'admin-stats') {
      const sessionToken = event.queryStringParameters?.sessionToken || '';
      const adminUser = await requireAdminBySession(sessionToken);
      if (!adminUser) {
        return response(403, { error: 'forbidden' });
      }

      const users = await sql`
        SELECT user_id, username, email, purchase_history, created_at
        FROM users
        ORDER BY created_at DESC;
      `;

      const purchases = [];
      let totalRevenue = 0;

      for (const user of users) {
        const history = Array.isArray(user.purchase_history) ? user.purchase_history : [];
        for (const purchase of history) {
          const total = Number(purchase.total || 0);
          purchases.push({
            userId: user.user_id,
            username: user.username,
            email: user.email,
            purchaseId: purchase.id || '',
            total,
            date: purchase.date || null,
            promoCode: purchase.promoCode || null
          });
          totalRevenue += Number.isFinite(total) ? total : 0;
        }
      }

      purchases.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      const activeSessionsRows = await sql`
        SELECT COUNT(*)::int AS count
        FROM sessions
        WHERE expires_at > NOW();
      `;
      const activeNow = activeSessionsRows[0]?.count || 0;

      const timelineRows = await sql`
        SELECT
          to_char(date_trunc('hour', created_at), 'YYYY-MM-DD"T"HH24:00:00"Z"') AS hour,
          COUNT(*)::int AS count
        FROM sessions
        WHERE created_at >= NOW() - INTERVAL '24 hours'
        GROUP BY 1
        ORDER BY 1 ASC;
      `;

      return response(200, {
        summary: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalPurchases: purchases.length,
          totalMembers: users.length,
          activeNow
        },
        purchases,
        members: users.map(u => ({
          userId: u.user_id,
          username: u.username,
          email: u.email,
          createdAt: u.created_at,
          purchaseCount: Array.isArray(u.purchase_history) ? u.purchase_history.length : 0
        })),
        activeTimeline: timelineRows
      });
    }

    if (event.httpMethod === 'POST' && action === 'import') {
      return response(501, { error: 'import_not_supported_on_serverless' });
    }

    return response(404, { error: 'not_found' });
  } catch (error) {
    console.error('api error', error);
    return response(500, { error: 'server_error' });
  }
}
