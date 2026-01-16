const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// This endpoint can be called manually or via Vercel Cron
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Newsletter-Secret'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Optional: Add a secret key for security
    const secretKey = req.headers['x-newsletter-secret'] || req.query.secret;
    if (process.env.NEWSLETTER_SECRET && secretKey !== process.env.NEWSLETTER_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Get email list from environment variable or use a default
        // Format: "email1@example.com,email2@example.com" or fetch from a database
        const emailList = process.env.NEWSLETTER_EMAILS || '';
        
        if (!emailList) {
            return res.status(400).json({ error: 'No email list configured. Set NEWSLETTER_EMAILS in Vercel.' });
        }

        const emails = emailList.split(',').map(email => email.trim()).filter(Boolean);
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
        const recipientEmail = process.env.RECIPIENT_EMAIL || 'mohammad@k2studio.co';

        // Get newsletter content from POST request or use default
        let newsletterSubject = process.env.NEWSLETTER_SUBJECT || 'Weekly Update from Thru';
        let newsletterContent = process.env.NEWSLETTER_CONTENT || `
            <h2>Weekly Update from Thru</h2>
            <p>Here's what's been happening this week...</p>
            <p>Customize this content in your Vercel environment variables or update the code.</p>
        `;

        // If POST request with custom content, use that instead
        if (req.method === 'POST' && req.body) {
            if (req.body.subject) {
                newsletterSubject = req.body.subject;
            }
            if (req.body.content) {
                newsletterContent = req.body.content;
            }
        }

        const results = [];
        const errors = [];

        // Send newsletter to all subscribers
        for (const email of emails) {
            try {
                const { data, error } = await resend.emails.send({
                    from: `Thru <${fromEmail}>`,
                    to: email,
                    subject: newsletterSubject,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                            <div style="background: #BF4E30; color: white; padding: 20px; text-align: center;">
                                <h1 style="margin: 0; font-size: 24px;">thru.</h1>
                            </div>
                            <div style="padding: 30px 20px; background: #EDEAE5;">
                                ${newsletterContent}
                                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #D3D3D3; font-size: 12px; color: #666;">
                                    <p>You're receiving this because you signed up for the Thru waitlist.</p>
                                    <p><a href="#" style="color: #BF4E30;">Unsubscribe</a></p>
                                </div>
                            </div>
                        </div>
                    `,
                });

                if (error) {
                    errors.push({ email, error: error.message });
                } else {
                    results.push({ email, success: true });
                }
            } catch (error) {
                errors.push({ email, error: error.message });
            }
        }

        // Also send a summary to the admin
        if (recipientEmail) {
            await resend.emails.send({
                from: `Thru <${fromEmail}>`,
                to: recipientEmail,
                subject: 'Newsletter Sent - Summary',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Newsletter Sent</h2>
                        <p><strong>Sent to:</strong> ${results.length} emails</p>
                        <p><strong>Failed:</strong> ${errors.length} emails</p>
                        ${errors.length > 0 ? `<p><strong>Errors:</strong><br>${errors.map(e => `${e.email}: ${e.error}`).join('<br>')}</p>` : ''}
                    </div>
                `,
            });
        }

        res.json({
            success: true,
            sent: results.length,
            failed: errors.length,
            results,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Newsletter error:', error);
        res.status(500).json({
            error: 'Failed to send newsletter',
            message: error.message,
        });
    }
};
