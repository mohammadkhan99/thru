const nodemailer = require('nodemailer');

// Email configuration (only if credentials are provided)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    } catch (error) {
        console.log('Email not configured, will log signups to console');
    }
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

        // Send email to joey@comethru.co (if transporter is configured)
        if (transporter) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'joey@comethru.co',
                subject: `New Waitlist Signup: ${email}`,
                text: `A new user has joined the waitlist:\n\nEmail: ${email}\n\nTimestamp: ${new Date().toISOString()}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #BF4E30;">New Waitlist Signup</h2>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        } else {
            // Log to console if email is not configured
            console.log(`New waitlist signup: ${email} at ${new Date().toISOString()}`);
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
