// Simple email storage endpoint
// In production, you'd want to use a database like Supabase, Airtable, or similar

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

        // For now, we'll just log it
        // In production, you'd store this in a database
        // You can use Supabase (free), Airtable, or any database
        console.log(`New subscriber: ${email} at ${new Date().toISOString()}`);

        // TODO: Store in database
        // Example with Supabase:
        // const { createClient } = require('@supabase/supabase-js');
        // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        // await supabase.from('subscribers').insert({ email, created_at: new Date() });

        res.json({
            success: true,
            message: 'Email stored successfully',
        });
    } catch (error) {
        console.error('Error storing email:', error);
        res.status(500).json({
            error: 'Failed to store email',
        });
    }
};
