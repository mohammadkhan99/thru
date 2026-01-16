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
        const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'; // Default Resend domain for testing
        
        if (resend) {
            const { data, error } = await resend.emails.send({
                from: `Thru Landing <${fromEmail}>`,
                to: recipientEmail,
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
                console.error('Resend error:', error);
                throw error;
            }
            
            console.log(`Email sent to ${recipientEmail} for signup: ${email}`);
        } else {
            // Log to console if email is not configured
            console.log(`New waitlist signup: ${email} at ${new Date().toISOString()}`);
            console.log(`(Email not configured - would send to ${recipientEmail})`);
        }

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
