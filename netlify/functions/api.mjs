import admin from 'firebase-admin';
import crypto from 'node:crypto';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
if (Object.keys(serviceAccount).length > 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const auth = admin.auth();

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

function toAppUser(doc) {
  const data = doc.data ? doc.data() : doc;
  return {
    userId: data.userId || doc.id,
    username: data.username || '',
    email: data.email || '',
    password: data.password || '',
    cart: Array.isArray(data.cart) ? JSON.stringify(data.cart) : '[]',
    wishlist: Array.isArray(data.wishlist) ? JSON.stringify(data.wishlist) : '[]',
    purchaseHistory: Array.isArray(data.purchaseHistory) ? JSON.stringify(data.purchaseHistory) : '[]',
    createdAt: data.createdAt || new Date().toISOString()
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

async function logAuth(type, identifier, success) {
  try {
    await db.collection('authLogs').add({
      type,
      identifier,
      success,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error logging auth:', e);
  }
}

async function createSession(userId) {
  const sessionToken = makeSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  
  try {
    await db.collection('sessions').doc(sessionToken).set({
      userId,
      expiresAt,
      createdAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error creating session:', e);
  }
  
  return sessionToken;
}

async function getUserBySession(sessionToken) {
  if (!sessionToken) return null;
  
  try {
    const sessionDoc = await db.collection('sessions').doc(sessionToken).get();
    
    if (!sessionDoc.exists) return null;
    
    const sessionData = sessionDoc.data();
    if (new Date(sessionData.expiresAt) < new Date()) {
      // Session expired
      await sessionDoc.ref.delete();
      return null;
    }
    
    const userDoc = await db.collection('users').doc(sessionData.userId).get();
    return userDoc.exists ? userDoc : null;
  } catch (e) {
    console.error('Error getting user by session:', e);
    return null;
  }
}

function isAdminUser(user) {
  if (!user) return false;
  const data = user.data ? user.data() : user;
  return data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD;
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
    const action = getAction(event);
    const body = parseBody(event);

    // Register endpoint
    if (event.httpMethod === 'POST' && action === 'register') {
      const { username, email, password } = body;
      if (!username || !email || !password) {
        return response(400, { error: 'missing' });
      }

      try {
        // Check if email already exists
        const existingUser = await db.collection('users').where('email', '==', email).limit(1).get();
        if (!existingUser.empty) {
          await logAuth('register', email, false);
          return response(409, { error: 'email_in_use' });
        }

        // Check if username already exists
        const existingUsername = await db.collection('users').where('username', '==', username).limit(1).get();
        if (!existingUsername.empty) {
          await logAuth('register', email, false);
          return response(409, { error: 'username_in_use' });
        }

        const userRef = db.collection('users').doc();
        const userId = userRef.id;

        await userRef.set({
          userId,
          username,
          email,
          password,
          cart: [],
          wishlist: [],
          purchaseHistory: [],
          createdAt: new Date().toISOString()
        });

        await logAuth('register', email, true);
        const sessionToken = await createSession(userId);
        
        const userData = {
          userId,
          username,
          email,
          password,
          cart: '[]',
          wishlist: '[]',
          purchaseHistory: '[]',
          createdAt: new Date().toISOString()
        };

        return response(200, { user: userData, sessionToken });
      } catch (e) {
        await logAuth('register', email, false);
        console.error('Registration error:', e);
        return response(500, { error: 'server_error' });
      }
    }

    // Login endpoint
    if (event.httpMethod === 'POST' && action === 'login') {
      const { identifier, password } = body;
      if (!identifier || !password) {
        return response(400, { error: 'missing' });
      }

      try {
        // Find user by email or username
        let userDoc = null;
        const emailQuery = await db.collection('users').where('email', '==', identifier).limit(1).get();
        
        if (!emailQuery.empty) {
          userDoc = emailQuery.docs[0];
        } else {
          const usernameQuery = await db.collection('users').where('username', '==', identifier).limit(1).get();
          if (!usernameQuery.empty) {
            userDoc = usernameQuery.docs[0];
          }
        }

        if (!userDoc) {
          await logAuth('login', identifier, false);
          return response(401, { error: 'no_account' });
        }

        const userData = userDoc.data();
        if (userData.password !== password) {
          await logAuth('login', identifier, false);
          return response(401, { error: 'invalid' });
        }

        await logAuth('login', identifier, true);
        const sessionToken = await createSession(userDoc.id);
        return response(200, { user: toAppUser(userData), sessionToken });
      } catch (e) {
        await logAuth('login', identifier, false);
        console.error('Login error:', e);
        return response(500, { error: 'server_error' });
      }
    }

    // Get session endpoint
    if (event.httpMethod === 'GET' && action === 'session') {
      const token = event.queryStringParameters?.token || '';
      const user = await getUserBySession(token);
      if (!user) return response(401, { error: 'invalid_session' });
      return response(200, { user: toAppUser(user) });
    }

    // Logout endpoint
    if (event.httpMethod === 'POST' && action === 'logout') {
      const { sessionToken } = body;
      if (sessionToken) {
        try {
          await db.collection('sessions').doc(sessionToken).delete();
        } catch (e) {
          console.error('Error deleting session:', e);
        }
      }
      return response(200, { success: true });
    }

    // Cart endpoint
    if (event.httpMethod === 'POST' && action === 'cart') {
      const { userId, cart, sessionToken } = body;
      let resolvedUserId = userId;

      if (!resolvedUserId && sessionToken) {
        try {
          const sessionDoc = await db.collection('sessions').doc(sessionToken).get();
          if (sessionDoc.exists) {
            resolvedUserId = sessionDoc.data().userId;
          }
        } catch (e) {
          console.error('Error resolving user:', e);
        }
      }

      if (!resolvedUserId) {
        return response(400, { error: 'missing_user' });
      }

      try {
        await db.collection('users').doc(resolvedUserId).update({
          cart: Array.isArray(cart) ? cart : []
        });
        return response(200, { success: true });
      } catch (e) {
        console.error('Error updating cart:', e);
        return response(500, { error: 'server_error' });
      }
    }

    // Get all users endpoint
    if (event.httpMethod === 'GET' && action === 'users') {
      try {
        const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
        const users = snapshot.docs.map(doc => toAppUser(doc));
        return response(200, users);
      } catch (e) {
        console.error('Error fetching users:', e);
        return response(500, { error: 'server_error' });
      }
    }

    // Get auth logs endpoint
    if (event.httpMethod === 'GET' && action === 'auth-logs') {
      try {
        const snapshot = await db.collection('authLogs').orderBy('timestamp', 'desc').limit(1000).get();
        const logs = snapshot.docs.map(doc => ({
          type: doc.data().type,
          identifier: doc.data().identifier,
          success: doc.data().success,
          timestamp: doc.data().timestamp
        }));
        return response(200, { logs });
      } catch (e) {
        console.error('Error fetching auth logs:', e);
        return response(500, { error: 'server_error' });
      }
    }

    // Admin stats endpoint
    if (event.httpMethod === 'GET' && action === 'admin-stats') {
      const sessionToken = event.queryStringParameters?.sessionToken || '';
      const adminUser = await requireAdminBySession(sessionToken);
      if (!adminUser) {
        return response(403, { error: 'forbidden' });
      }

      try {
        const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
        const users = usersSnapshot.docs;

        const purchases = [];
        let totalRevenue = 0;

        for (const userDoc of users) {
          const userData = userDoc.data();
          const history = Array.isArray(userData.purchaseHistory) ? userData.purchaseHistory : [];
          
          for (const purchase of history) {
            const total = Number(purchase.total || 0);
            purchases.push({
              userId: userData.userId,
              username: userData.username,
              email: userData.email,
              purchaseId: purchase.id || '',
              total,
              date: purchase.date || null,
              promoCode: purchase.promoCode || null
            });
            totalRevenue += Number.isFinite(total) ? total : 0;
          }
        }

        purchases.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        // Get active sessions count
        const sessionsSnapshot = await db.collection('sessions').get();
        let activeNow = 0;
        for (const sessionDoc of sessionsSnapshot.docs) {
          const sessionData = sessionDoc.data();
          if (new Date(sessionData.expiresAt) > new Date()) {
            activeNow++;
          }
        }

        // Calculate timeline (last 24 hours)
        const activeTimeline = [];
        const now = new Date();
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
          const hourStr = hour.toISOString().substring(0, 13) + ':00:00Z';
          activeTimeline.push({ hour: hourStr, count: 0 });
        }

        return response(200, {
          summary: {
            totalRevenue: Number(totalRevenue.toFixed(2)),
            totalPurchases: purchases.length,
            totalMembers: users.length,
            activeNow
          },
          purchases,
          members: users.map(u => {
            const data = u.data();
            return {
              userId: data.userId,
              username: data.username,
              email: data.email,
              createdAt: data.createdAt,
              purchaseCount: Array.isArray(data.purchaseHistory) ? data.purchaseHistory.length : 0
            };
          }),
          activeTimeline
        });
      } catch (e) {
        console.error('Error fetching admin stats:', e);
        return response(500, { error: 'server_error' });
      }
    }

    // Import endpoint (not supported)
    if (event.httpMethod === 'POST' && action === 'import') {
      return response(501, { error: 'import_not_supported_on_serverless' });
    }

    return response(404, { error: 'not_found' });
  } catch (error) {
    console.error('api error', error);
    return response(500, { error: 'server_error' });
  }
}
