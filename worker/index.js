const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

async function verifyToken(request, env) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !env.CLERK_ISSUER || env.CLERK_ISSUER.includes('replace-with')) throw new Error('Sign in is not configured.');
  const [headerPart, payloadPart, signaturePart] = token.split('.');
  if (!headerPart || !payloadPart || !signaturePart) throw new Error('Please sign in again.');
  const decode = (part) => JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
  const header = decode(headerPart), claims = decode(payloadPart);
  if (header.alg !== 'RS256' || !header.kid) throw new Error('Invalid sign-in token.');
  const issuer = env.CLERK_ISSUER.replace(/\/$/, '');
  if (claims.iss !== issuer || claims.exp < Date.now() / 1000 || !claims.sub) throw new Error('Please sign in again.');
  const jwksResponse = await fetch(`${issuer}/.well-known/jwks.json`);
  if (!jwksResponse.ok) throw new Error('Unable to verify your sign-in.');
  const jwks = await jwksResponse.json();
  const jwk = jwks.keys.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error('Unable to verify your sign-in.');
  const publicKey = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const signature = Uint8Array.from(atob(signaturePart.replace(/-/g, '+').replace(/_/g, '/')), (char) => char.charCodeAt(0));
  const signedData = new TextEncoder().encode(`${headerPart}.${payloadPart}`);
  if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', publicKey, signature, signedData)) throw new Error('Invalid sign-in token.');
  let email = '';
  if (env.CLERK_SECRET_KEY) {
    const userResponse = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(claims.sub)}`, { headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}` } });
    if (userResponse.ok) {
      const clerkUser = await userResponse.json();
      email = clerkUser.email_addresses?.find((item) => item.id === clerkUser.primary_email_address_id)?.email_address || '';
    }
  }
  return { id: claims.sub, email };
}

function isAdmin(user, env) {
  const allowlist = (env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
  return user.email && allowlist.includes(user.email.toLowerCase());
}

async function handleApi(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/api/health') return json({ ok: true });
  if (url.pathname === '/api/content' && request.method === 'GET') {
    const row = await env.DB.prepare("SELECT value FROM site_content WHERE key = 'settings'").first();
    return json({ content: row ? JSON.parse(row.value) : null });
  }
  if (url.pathname === '/api/enquiries' && request.method === 'POST') {
    let user;
    try { user = await verifyToken(request, env); } catch (error) { return json({ error: error.message }, 401); }
    let data;
    try { data = await request.json(); } catch { return json({ error: 'Please check the form and try again.' }, 400); }
    const required = ['student_name', 'parent_name', 'parent_phone', 'class_applied', 'entry_type', 'address', 'religion'];
    if (required.some((key) => typeof data[key] !== 'string' || !data[key].trim())) return json({ error: 'Please complete all required fields.' }, 400);
    if (!user.email) return json({ error: 'Your Google account email could not be verified. Please sign in again.' }, 401);
    if (data.entry_type === 'transfer' && !String(data.previous_school || '').trim()) return json({ error: 'Please enter the previous school name.' }, 400);
    const aadhaar = String(data.aadhaar_number || '').replace(/\D/g, '');
    if (aadhaar && !/^\d{12}$/.test(aadhaar)) return json({ error: 'Aadhaar must contain 12 digits.' }, 400);
    const id = crypto.randomUUID();
    await env.DB.prepare(`INSERT INTO enquiries (id, parent_user_id, parent_email, student_name, parent_name, parent_phone, class_applied, entry_type, previous_school, aadhaar_last4, address, religion, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(id, user.id, user.email, data.student_name.trim().slice(0, 120), data.parent_name.trim().slice(0, 120), data.parent_phone.trim().slice(0, 24), data.class_applied.trim().slice(0, 40), data.entry_type === 'transfer' ? 'transfer' : 'new', data.entry_type === 'transfer' ? String(data.previous_school).trim().slice(0, 180) : null, aadhaar ? aadhaar.slice(-4) : null, data.address.trim().slice(0, 800), data.religion.trim().slice(0, 60), String(data.message || '').trim().slice(0, 1200)).run();
    return json({ ok: true, id }, 201);
  }
  if (url.pathname === '/api/admin/enquiries' && request.method === 'GET') {
    let user;
    try { user = await verifyToken(request, env); } catch (error) { return json({ error: error.message }, 401); }
    if (!isAdmin(user, env)) return json({ error: 'This account does not have admissions staff access.' }, 403);
    const { results } = await env.DB.prepare('SELECT id, created_at, updated_at, parent_email, student_name, parent_name, parent_phone, class_applied, entry_type, previous_school, address, religion, message, status FROM enquiries ORDER BY created_at DESC LIMIT 500').all();
    return json({ enquiries: results });
  }
  if (url.pathname === '/api/admin/content' && request.method === 'PUT') {
    let user;
    try { user = await verifyToken(request, env); } catch (error) { return json({ error: error.message }, 401); }
    if (!isAdmin(user, env)) return json({ error: 'This account does not have admissions staff access.' }, 403);
    const data = await request.json().catch(() => null);
    if (!data || typeof data !== 'object' || Array.isArray(data) || data.schemaVersion !== 3) return json({ error: 'Website content was not valid.' }, 400);
    const sanitize = (value, depth = 0) => {
      if (depth > 10) return null;
      if (typeof value === 'string') return value.slice(0, 5000);
      if (typeof value === 'boolean' || value === null) return value;
      if (typeof value === 'number') return Number.isFinite(value) ? value : null;
      if (Array.isArray(value)) return value.slice(0, 100).map(item => sanitize(item, depth + 1));
      if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).slice(0, 100).map(([key, item]) => [key.slice(0, 100), sanitize(item, depth + 1)]));
      return null;
    };
    const settings = sanitize(data);
    await env.DB.prepare("INSERT INTO site_content (key, value, updated_at) VALUES ('settings', ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')").bind(JSON.stringify(settings)).run();
    return json({ ok: true, content: settings });
  }
  const statusMatch = url.pathname.match(/^\/api\/admin\/enquiries\/([0-9a-f-]+)$/i);
  if (statusMatch && request.method === 'PATCH') {
    let user;
    try { user = await verifyToken(request, env); } catch (error) { return json({ error: error.message }, 401); }
    if (!isAdmin(user, env)) return json({ error: 'This account does not have admissions staff access.' }, 403);
    const { status } = await request.json().catch(() => ({}));
    if (!['New', 'Contacted', 'Visit scheduled', 'Admitted', 'Closed'].includes(status)) return json({ error: 'Choose a valid enquiry status.' }, 400);
    await env.DB.prepare("UPDATE enquiries SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, statusMatch[1]).run();
    return json({ ok: true });
  }
  return json({ error: 'Not found.' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': url.origin, 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS' } });
      try { return await handleApi(request, env); } catch (error) { console.error('Admissions API error', error); return json({ error: 'The request could not be saved. Please try again.' }, 500); }
    }
    return env.ASSETS.fetch(request);
  }
};
