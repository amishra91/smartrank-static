import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderConfirmationEmail(name: string) {
  const firstName = name.trim().split(' ')[0] || name;
  const brand = {
    purple: '#6939fa',
    ink: '#101012',
    muted: '#6c6c74',
    border: '#e6e6ea',
    background: '#f4f4f6',
    card: '#ffffff',
  };
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SmartRank Early Access</title>
  </head>
  <body style="margin:0; padding:0; background-color:${brand.background}; font-family:${fontStack};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${brand.background};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
            <tr>
              <td style="background-color:${brand.card}; border:1px solid ${brand.border}; border-radius:14px; padding:36px 36px 40px 36px;">
                <div style="margin:0 0 24px 0; padding-bottom:20px; border-bottom:1px solid ${brand.border};">
                  <a href="https://hunarmind.com/smartrank" style="display:inline-block; text-decoration:none;">
                    <img src="https://www.thesmartrank.com/smartrank-logo.svg" width="180" height="38" alt="SmartRank" style="display:block; width:180px; height:auto; border:0;" />
                  </a>
                </div>
                <p style="margin:0 0 16px 0; font-family:${fontStack}; font-size:16px; line-height:1.6; color:${brand.ink};">
                  Hi ${escapeHtml(firstName)},
                </p>
                <p style="margin:0 0 20px 0; font-family:${fontStack}; font-size:15px; line-height:1.6; color:${brand.ink};">
                  Thank you for registering for SmartRank. 💜
                </p>
                <div style="background-color:${brand.background}; border:1px solid ${brand.border}; border-radius:12px; padding:20px 24px; margin:0 0 24px 0;">
                  <p style="margin:0 0 8px 0; font-family:${fontStack}; font-size:16px; font-weight:700; color:${brand.purple};">
                    🎁 Your early-bird benefit is unlocked
                  </p>
                  <p style="margin:0; font-family:${fontStack}; font-size:14px; line-height:1.6; color:${brand.ink};">
                    When SmartRank launches, you'll receive an additional <strong>10% OFF</strong> your first subscription payment, on top of our launch offer.
                  </p>
                </div>
                <p style="margin:0 0 16px 0; font-family:${fontStack}; font-size:15px; line-height:1.6; color:${brand.muted};">
                  It's our way of saying thank you for getting in early.
                </p>
                <p style="margin:0 0 28px 0; font-family:${fontStack}; font-size:15px; line-height:1.6; color:${brand.muted};">
                  Your benefit is tied to the email address you used to register, so there's nothing else you need to do right now.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-radius:8px; background-color:${brand.purple};">
                      <a href="https://hunarmind.com/smartrank" style="display:inline-block; padding:12px 24px; font-family:${fontStack}; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;">Explore SmartRank</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 8px 0 8px;">
                <p style="margin:0; font-family:${fontStack}; font-size:12px; line-height:1.6; color:${brand.muted};">
                  SmartRank &middot; Dedicated competitive exam intelligence
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Hi ${firstName},`,
    '',
    'Thank you for registering for SmartRank. 💜',
    '',
    '🎁 Your early-bird benefit is unlocked',
    '',
    `When SmartRank launches, you'll receive an additional 10% OFF your first subscription payment, on top of our launch offer.`,
    '',
    `It's our way of saying thank you for getting in early.`,
    '',
    `Your benefit is tied to the email address you used to register, so there's nothing else you need to do right now.`,
  ].join('\n');

  return { html, text };
}

function earlyAccessPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'early-access-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.originalUrl || req.url || '';
        if (url === '/api/early-access' || url.startsWith('/api/early-access?') || url.startsWith('/api/early-access/')) {
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.statusCode = 200;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let rawBody = '';
            req.on('data', (chunk: any) => {
              rawBody += chunk;
            });

            req.on('end', async () => {
              try {
                const data = JSON.parse(rawBody || '{}');
                const name = String(data.name || '').trim();
                const email = String(data.email || '').trim().toLowerCase();
                const examStream = String(data.examStream || '').trim();
                const targetYear = String(data.targetYear || '').trim();

                if (!name || !email) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Name and email are required' }));
                  return;
                }

                const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
                if (!apiKey) {
                  console.error('RESEND_API_KEY is not configured');
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'RESEND_API_KEY is not configured' }));
                  return;
                }

                const fromEmail = env.CONTACT_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || 'Hunarmind <no-reply@hunarmind.com>';
                const toEmail = env.CONTACT_TO_EMAIL || process.env.CONTACT_TO_EMAIL || 'hello@hunarmind.com';

                const confirmation = renderConfirmationEmail(name);

                await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    from: fromEmail,
                    to: [email],
                    reply_to: toEmail,
                    subject: 'Your early-bird benefit is unlocked | SmartRank',
                    html: confirmation.html,
                    text: confirmation.text,
                  }),
                });

                await fetch('https://api.resend.com/emails', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    from: fromEmail,
                    to: [toEmail],
                    reply_to: email,
                    subject: `SmartRank Early Access Request: ${name}`,
                    text: `New early access request:\nName: ${name}\nEmail: ${email}\nTarget Exam: ${examStream || 'N/A'}\nTarget Cycle: ${targetYear || 'N/A'}`,
                  }),
                }).catch(() => {});

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err?.message || 'Internal server error' }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), earlyAccessPlugin(env)],
  };
});
