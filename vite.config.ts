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

function renderConfirmationEmail(
  name: string,
  selectedPlan?: string,
  examStream?: string,
  targetYear?: string
) {
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

  const isFocus = selectedPlan === 'focus';
  const isLearn = selectedPlan === 'learn';
  const isUndecided = selectedPlan === 'undecided';

  let planName = 'Achieve Plan';
  let planPrice = '₹1,499/month';
  let badgeTitle = '👑 Your early-bird benefit is unlocked (Achieve Plan)';
  let subject = 'Your 50% launch discount + early-bird benefit is unlocked | SmartRank';
  let badgeDescriptionHtml = '';
  let badgeDescriptionText = '';
  let featuresHtml = '';
  let featuresText = '';

  if (isFocus) {
    planName = 'Focus Plan';
    planPrice = '₹4,999/exam (Complete Pass)';
    badgeTitle = '🎯 Priority Reservation Confirmed (Focus Plan)';
    subject = 'Your Focus Plan reservation is confirmed | SmartRank';
    badgeDescriptionHtml = 'Your reservation for the <strong>Focus Plan</strong> (complete target exam pass at ₹4,999/exam) has been confirmed for your upcoming exam cycle. You will receive comprehensive single-exam preparation with <strong>zero recurring subscription fees</strong> through your final results.';
    badgeDescriptionText = 'Your reservation for the Focus Plan (complete target exam pass at ₹4,999/exam) has been confirmed for your upcoming exam cycle. You will receive comprehensive single-exam preparation with zero recurring subscription fees through your final results.';
    featuresHtml = `
      <ul style="margin:12px 0 0 0; padding-left:20px; font-size:13px; line-height:1.6; color:#374151;">
        <li>5 years of verified Previous Year Questions (PYQs)</li>
        <li>5&times; AI Tutor problem-breakdown sessions per day</li>
        <li>Complete exam-focused syllabus notes & study material</li>
        <li>Full mock test engine matching official exam interface & timing</li>
        <li>Advanced rank analytics & exam predictor</li>
      </ul>
    `;
    featuresText = [
      '- 5 years of verified PYQs',
      '- 5x AI Tutor problem-breakdown sessions per day',
      '- Complete exam-focused syllabus notes & study material',
      '- Full mock test engine with official timing',
      '- Advanced rank analytics & exam predictor',
    ].join('\n');
  } else if (isLearn) {
    planName = 'Learn Plan';
    planPrice = '₹749/month (50% OFF)';
    badgeTitle = '📖 Your early-bird benefit is unlocked (Learn Plan)';
    subject = 'Your 50% launch discount + early-bird benefit is unlocked | SmartRank';
    badgeDescriptionHtml = 'When SmartRank launches, your reserved spot for the <strong>Learn Plan</strong> will be activated at <strong>₹749/month</strong> (50% off regular ₹1,499/month), plus an additional <strong>10% OFF</strong> your first month payment as a pre-launch registrant.';
    badgeDescriptionText = 'When SmartRank launches, your reserved spot for the Learn Plan will be activated at ₹749/month (50% off regular ₹1,499/month), plus an additional 10% OFF your first month payment as a pre-launch registrant.';
    featuresHtml = `
      <ul style="margin:12px 0 0 0; padding-left:20px; font-size:13px; line-height:1.6; color:#374151;">
        <li>3 years of categorized Previous Year Questions (PYQs)</li>
        <li>Essential AI Tutor conceptual clarifications</li>
        <li>Core study material & structured notes</li>
        <li>Sectional drills & foundational diagnostic plan</li>
        <li>Cutoff benchmarks & exam predictor</li>
      </ul>
    `;
    featuresText = [
      '- 3 years of categorized PYQs',
      '- Essential AI Tutor conceptual clarifications',
      '- Core study material & structured notes',
      '- Sectional drills & foundational diagnostic plan',
      '- Cutoff benchmarks & exam predictor',
    ].join('\n');
  } else if (isUndecided) {
    planName = 'Exploring Platform / Undecided';
    planPrice = 'Cohort Access';
    badgeTitle = '✨ Your priority waitlist spot is confirmed';
    subject = 'Your priority early access is confirmed | SmartRank';
    badgeDescriptionHtml = 'Your spot on the SmartRank priority waitlist is reserved. You will receive private beta invitation access with <strong>zero cost during the testing cohort</strong>, plus your early-bird discount voucher unlocked for eligible tiers.';
    badgeDescriptionText = 'Your spot on the SmartRank priority waitlist is reserved. You will receive private beta invitation access with zero cost during the testing cohort, plus your early-bird discount voucher unlocked for eligible tiers.';
  } else {
    // Achieve Plan (Default / Recommended)
    planName = 'Achieve Plan';
    planPrice = '₹1,499/month (50% OFF)';
    badgeTitle = '👑 Your early-bird benefit is unlocked (Achieve Plan)';
    subject = 'Your 50% launch discount + early-bird benefit is unlocked | SmartRank';
    badgeDescriptionHtml = 'When SmartRank launches, your reserved spot for the <strong>Achieve Plan</strong> will be activated at <strong>₹1,499/month</strong> (50% off regular ₹2,999/month), plus an additional <strong>10% OFF</strong> your first month payment as a pre-launch registrant.';
    badgeDescriptionText = 'When SmartRank launches, your reserved spot for the Achieve Plan will be activated at ₹1,499/month (50% off regular ₹2,999/month), plus an additional 10% OFF your first month payment as a pre-launch registrant.';
    featuresHtml = `
      <ul style="margin:12px 0 0 0; padding-left:20px; font-size:13px; line-height:1.6; color:#374151;">
        <li>10 years of verified PYQs with step-by-step rationales</li>
        <li>10&times; AI Tutor interactions per day & misconception tracking</li>
        <li>In-depth study material, structured notes & revision summaries</li>
        <li>Full mock test library matching official exam conditions</li>
        <li>Adaptive milestone study plan, rank prediction & exam forecast</li>
      </ul>
    `;
    featuresText = [
      '- 10 years of verified PYQs with step-by-step rationales',
      '- 10x AI Tutor interactions/day & misconception tracking',
      '- In-depth study material & revision summaries',
      '- Full mock test library matching official exam conditions',
      '- Adaptive study plan, rank prediction & exam forecast',
    ].join('\n');
  }

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:${brand.background}; font-family:${fontStack};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${brand.background};">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">
            <tr>
              <td style="background-color:${brand.card}; border:1px solid ${brand.border}; border-radius:16px; padding:36px 36px 40px 36px;">
                <div style="margin:0 0 24px 0; padding-bottom:20px; border-bottom:1px solid ${brand.border};">
                  <a href="https://hunarmind.com/smartrank" style="display:inline-block; text-decoration:none;">
                    <img src="https://www.thesmartrank.com/smartrank-logo.svg" width="180" height="38" alt="SmartRank" style="display:block; width:180px; height:auto; border:0;" />
                  </a>
                </div>
                <p style="margin:0 0 14px 0; font-family:${fontStack}; font-size:17px; line-height:1.5; color:${brand.ink};">
                  Hi ${escapeHtml(firstName)},
                </p>
                <p style="margin:0 0 20px 0; font-family:${fontStack}; font-size:15px; line-height:1.6; color:${brand.ink};">
                  Thank you for reserving priority early access to SmartRank. 💜
                </p>
                <div style="background-color:${brand.background}; border:1px solid ${brand.border}; border-radius:12px; padding:22px 24px; margin:0 0 24px 0;">
                  <p style="margin:0 0 8px 0; font-family:${fontStack}; font-size:16px; font-weight:700; color:${brand.purple};">
                    ${badgeTitle}
                  </p>
                  <p style="margin:0; font-family:${fontStack}; font-size:14px; line-height:1.6; color:${brand.ink};">
                    ${badgeDescriptionHtml}
                  </p>
                  ${featuresHtml}
                </div>

                <div style="background-color:#ffffff; border:1px solid ${brand.border}; border-radius:12px; padding:18px 22px; margin:0 0 24px 0;">
                  <p style="margin:0 0 10px 0; font-family:${fontStack}; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${brand.muted};">
                    Registration Summary
                  </p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:${fontStack}; font-size:14px; line-height:1.7;">
                    <tr>
                      <td style="color:${brand.muted}; padding:3px 0; width:38%;">Target Exam:</td>
                      <td style="color:${brand.ink}; font-weight:600; padding:3px 0;">${escapeHtml(examStream || 'Competitive Examination')}</td>
                    </tr>
                    <tr>
                      <td style="color:${brand.muted}; padding:3px 0;">Exam Cycle:</td>
                      <td style="color:${brand.ink}; font-weight:600; padding:3px 0;">${escapeHtml(targetYear ? `${targetYear} Cycle` : '2026 Cycle')}</td>
                    </tr>
                    <tr>
                      <td style="color:${brand.muted}; padding:3px 0;">Selected Tier:</td>
                      <td style="color:${brand.purple}; font-weight:700; padding:3px 0;">${escapeHtml(planName)} (${escapeHtml(planPrice)})</td>
                    </tr>
                    <tr>
                      <td style="color:${brand.muted}; padding:3px 0;">Cohort Access:</td>
                      <td style="color:#16a34a; font-weight:600; padding:3px 0;">Priority Reserved (Zero Cost Beta)</td>
                    </tr>
                  </table>
                </div>

                <p style="margin:0 0 12px 0; font-family:${fontStack}; font-size:15px; font-weight:700; color:${brand.ink};">
                  What happens next?
                </p>
                <p style="margin:0 0 24px 0; font-family:${fontStack}; font-size:14px; line-height:1.6; color:${brand.muted};">
                  When candidate onboarding batches open, we will send your private onboarding invitation, diagnostic baseline test, and locked-in benefits directly to this email address.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;">
                  <tr>
                    <td style="border-radius:10px; background-color:${brand.purple};">
                      <a href="https://hunarmind.com/smartrank" style="display:inline-block; padding:12px 26px; font-family:${fontStack}; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px;">Explore SmartRank Platform</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 8px 0 8px;">
                <p style="margin:0; font-family:${fontStack}; font-size:12px; line-height:1.6; color:${brand.muted}; text-align:center;">
                  SmartRank &middot; Dedicated competitive exam intelligence &middot; An applied AI initiative by <a href="https://hunarmind.com" style="color:${brand.purple}; text-decoration:none;">Hunarmind Technologies</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textLines = [
    `Hi ${firstName},`,
    '',
    'Thank you for reserving priority early access to SmartRank. 💜',
    '',
    badgeTitle,
    '',
    badgeDescriptionText,
    '',
  ];

  if (featuresText) {
    textLines.push('Included Capabilities:', featuresText, '');
  }

  textLines.push(
    'REGISTRATION SUMMARY:',
    `- Target Exam: ${examStream || 'Competitive Examination'}`,
    `- Exam Cycle: ${targetYear ? `${targetYear} Cycle` : '2026 Cycle'}`,
    `- Selected Tier: ${planName} (${planPrice})`,
    '- Cohort Access: Priority Reserved (Zero Cost Beta)',
    '',
    'WHAT HAPPENS NEXT:',
    'When candidate onboarding batches open, we will send your private onboarding invitation, diagnostic baseline test, and locked-in benefits directly to this email address.',
    '',
    'Explore SmartRank Platform: https://hunarmind.com/smartrank',
    '',
    'SmartRank · Dedicated competitive exam intelligence',
    'An applied AI initiative by Hunarmind Technologies'
  );

  const text = textLines.join('\n');

  return { subject, html, text };
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
                const selectedPlan = String(data.selectedPlan || '').trim();

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

                const confirmation = renderConfirmationEmail(name, selectedPlan, examStream, targetYear);

                const planLabel = selectedPlan === 'learn'
                  ? 'Learn Plan (₹749/mo - 50% OFF)'
                  : selectedPlan === 'focus'
                  ? 'Focus Plan (₹4,999/exam - Target Pass)'
                  : selectedPlan === 'undecided'
                  ? 'Undecided / Exploring'
                  : 'Achieve Plan (₹1,499/mo - 50% OFF)';

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
                    subject: confirmation.subject,
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
                    subject: `SmartRank Early Access: ${name} [${planLabel}]`,
                    text: `New early access request:\nName: ${name}\nEmail: ${email}\nTarget Exam: ${examStream || 'N/A'}\nTarget Cycle: ${targetYear || 'N/A'}\nSelected Tier: ${planLabel}\nSubmitted At: ${new Date().toISOString()}`,
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
