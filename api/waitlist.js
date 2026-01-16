const { Resend } = require('resend');

// Initialize Resend (only if API key is provided)
let resend = null;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        // Send email using Resend (if configured)
        // Currently set to test email, change to 'joey@comethru.co' for production
        const recipientEmail = process.env.RECIPIENT_EMAIL || 'mohammad@k2studio.co';
        // For testing: Use the Resend account email or verify a domain
        // The onboarding@resend.dev domain can only send to the Resend account owner's email
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
        
        // If using test domain, we need to send to the Resend account email
        // Get it from environment or use recipientEmail if it's the account owner
        const resendAccountEmail = process.env.RESEND_ACCOUNT_EMAIL;
        const actualRecipient = (fromEmail.includes('resend.dev') && resendAccountEmail) 
            ? resendAccountEmail 
            : recipientEmail;
        
        if (resend) {
            try {
                const { data, error } = await resend.emails.send({
                    from: `Thru Landing <${fromEmail}>`,
                    to: actualRecipient,
                    subject: `New Thru Waitlist Signup: ${email}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
                            <h2 style="color: #BF4E30; border-bottom: 2px solid #BF4E30; padding-bottom: 10px;">New Thru Waitlist Signup</h2>
                            <p style="font-size: 16px; margin: 20px 0;"><strong>Email:</strong> ${email}</p>
                            <p style="font-size: 14px; color: #666;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                            <p style="margin-top: 30px; font-size: 12px; color: #999;">This email was sent from the Thru landing page waitlist form.</p>
                        </div>
                    `,
                });

                if (error) {
                    console.error('Resend error:', JSON.stringify(error, null, 2));
                    return res.status(500).json({ 
                        error: 'Failed to send email',
                        details: error.message || JSON.stringify(error),
                        recipient: recipientEmail,
                        from: fromEmail
                    });
                }
                
                console.log(`✅ Email sent successfully to ${actualRecipient} for signup: ${email}`);
                console.log(`Resend response:`, data);
                
                // If we had to use account email, note it in the response
                if (actualRecipient !== recipientEmail) {
                    console.log(`⚠️ Note: Sent to Resend account email (${actualRecipient}) instead of ${recipientEmail} because test domain restrictions. Verify a domain in Resend to send to any email.`);
                }
            } catch (err) {
                console.error('Exception sending email:', err);
                return res.status(500).json({ 
                    error: 'Failed to send email',
                    details: err.message,
                    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
                });
            }
        } else {
            // Log to console if email is not configured
            console.log(`⚠️ New waitlist signup: ${email} at ${new Date().toISOString()}`);
            console.log(`⚠️ RESEND_API_KEY not configured - email would be sent to ${recipientEmail}`);
            return res.status(500).json({ 
                error: 'Email service not configured',
                message: 'RESEND_API_KEY environment variable is missing. Please configure it in Vercel.'
            });
        }

        // Store email for newsletter (optional - can be done via database)
        // For now, we'll just log it. You can add database storage here.
        console.log(`Subscriber added to newsletter list: ${email}`);

        res.json({ 
            success: true, 
            message: 'Successfully added to waitlist' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to process waitlist signup' 
        });
    }
};
