const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Optional: Add basic auth check
        const authSecret = req.query.secret || req.headers['x-auth-secret'];
        const requiredSecret = process.env.ADMIN_SECRET;
        
        if (requiredSecret && authSecret !== requiredSecret) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get all signups from KV
        const signups = await kv.lrange('waitlist:signups', 0, -1);
        
        // Parse JSON strings and reverse to show newest first
        const parsedSignups = signups
            .map(s => {
                try {
                    return JSON.parse(s);
                } catch (e) {
                    return null;
                }
            })
            .filter(s => s !== null)
            .reverse(); // Newest first

        res.json({
            success: true,
            count: parsedSignups.length,
            signups: parsedSignups
        });
    } catch (error) {
        console.error('Error fetching signups:', error);
        res.status(500).json({
            error: 'Failed to fetch signups',
            details: error.message
        });
    }
};
