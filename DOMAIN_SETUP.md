# Setting Up a Custom Domain

This guide will walk you through connecting your Thru landing page to a custom domain (e.g., `comethru.co` or `thru.com`).

## Step 1: Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `comethru.co` or `www.comethru.co`)
5. Click **Add**

## Step 2: Configure DNS Records

Vercel will show you the DNS records you need to add. You'll need to add these at your domain registrar (where you bought the domain).

### Option A: Root Domain (e.g., `comethru.co`)

Add an **A record**:
- **Type:** A
- **Name:** @ (or leave blank)
- **Value:** `76.76.21.21` (Vercel's IP - they'll show you the exact IP)
- **TTL:** Auto (or 3600)

### Option B: Subdomain (e.g., `www.comethru.co`)

Add a **CNAME record**:
- **Type:** CNAME
- **Name:** www
- **Value:** `cname.vercel-dns.com` (Vercel will show you the exact value)
- **TTL:** Auto (or 3600)

### Option C: Both Root + WWW

You can add both:
- A record for `comethru.co` → `76.76.21.21`
- CNAME record for `www.comethru.co` → `cname.vercel-dns.com`

**Or** use Vercel's automatic redirect:
- Add A record for root domain
- Vercel can automatically redirect `www` to root (or vice versa)

## Step 3: Wait for DNS Propagation

- DNS changes can take **5 minutes to 48 hours** to propagate
- Usually it's much faster (15-30 minutes)
- Vercel will show you the status in the dashboard
- You'll see a green checkmark when it's ready

## Step 4: SSL Certificate (Automatic!)

- Vercel automatically provisions SSL certificates via Let's Encrypt
- Your site will be available at `https://yourdomain.com`
- This happens automatically once DNS is configured
- No action needed from you!

## Step 5: Update Email Configuration

Once your domain is live, update your email settings:

### In Resend:

1. Go to Resend → **Domains** → **Add Domain**
2. Add your domain (e.g., `comethru.co`)
3. Resend will show you DNS records to add:
   - **SPF record** (TXT)
   - **DKIM records** (TXT)
   - **DMARC record** (TXT - optional but recommended)
4. Add these DNS records at your domain registrar
5. Wait for verification (usually 5-15 minutes)

### In Vercel Environment Variables:

Update these after Resend domain is verified:

1. **FROM_EMAIL** = `noreply@comethru.co` (or your verified domain)
2. **RECIPIENT_EMAIL** = `joey@comethru.co` (or your production email)

## Common Domain Registrars & Where to Find DNS Settings

- **Namecheap:** Domain List → Manage → Advanced DNS
- **GoDaddy:** My Products → DNS
- **Google Domains:** DNS → Custom records
- **Cloudflare:** DNS → Records
- **Route 53 (AWS):** Hosted zones → Your domain → Create record

## Troubleshooting

### Domain not working?

1. **Check DNS propagation:**
   - Use [whatsmydns.net](https://www.whatsmydns.net) to check if DNS has propagated
   - Enter your domain and check A/CNAME records

2. **Check Vercel status:**
   - Go to Settings → Domains
   - Look for error messages
   - Vercel will tell you what's wrong

3. **Common issues:**
   - **"Invalid configuration"** → Check DNS records match exactly what Vercel shows
   - **"DNS not propagated"** → Wait longer (can take up to 48 hours)
   - **"Certificate pending"** → Wait for SSL to provision (usually 5-10 minutes after DNS)

### Want to redirect www to root (or vice versa)?

In Vercel → Settings → Domains:
- You can configure automatic redirects
- Choose: `www` → root, or root → `www`

## After Setup

Once your domain is live:

1. ✅ Your site will be at `https://yourdomain.com`
2. ✅ SSL certificate is automatic
3. ✅ Update `FROM_EMAIL` in Resend/Vercel
4. ✅ Test the waitlist form
5. ✅ Update any links/bookmarks to use the new domain

## Need Help?

- Vercel docs: [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- Resend docs: [resend.com/docs/dashboard/domains/introduction](https://resend.com/docs/dashboard/domains/introduction)
