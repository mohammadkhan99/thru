# thru. Landing Page

A modern, tech-focused landing page with email waitlist functionality.

## Features

- Minimalist design matching the thru. brand aesthetic
- Email waitlist form
- Responsive design
- Smooth animations
- Tech-focused UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure your email settings in `.env`:
   - For Gmail, you'll need to generate an App Password
   - Go to Google Account → Security → 2-Step Verification → App passwords

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. Open `http://localhost:3000` in your browser

## Email Configuration

The waitlist form sends emails when users sign up. Currently configured to send to `mohammad@k2studio.co` for testing. Change to `joey@comethru.co` for production.

### Vercel Environment Variables

Set these in your Vercel project settings:

1. **RESEND_API_KEY** - Your Resend API key (get it from [resend.com](https://resend.com))
2. **FROM_EMAIL** - Email address to send from (optional, defaults to Resend's test domain)
3. **RECIPIENT_EMAIL** - Email to receive waitlist signups (defaults to `mohammad@k2studio.co` if not set)
   - For testing: `mohammad@k2studio.co`
   - For production: `joey@comethru.co`

### Resend Setup (Easy - No App Passwords!)

1. Go to [resend.com](https://resend.com) and sign up (free tier: 3,000 emails/month)
2. Verify your email
3. Go to API Keys and create a new API key
4. Copy the API key and add it as `RESEND_API_KEY` in Vercel
5. (Optional) Add your domain in Resend to send from your own email address
6. That's it! Much easier than Gmail app passwords.

**Note:** For production, you'll want to add your domain in Resend and set `FROM_EMAIL` to something like `noreply@yourdomain.com`

## Deployment

You can deploy this to:
- **Vercel**: Connect your repo and set environment variables
- **Heroku**: Use the Procfile and set config vars
- **Railway**: Connect repo and add environment variables
- **Any Node.js hosting**: Ensure environment variables are set

## Project Structure

```
.
├── index.html      # Main landing page
├── styles.css      # Styling
├── script.js       # Frontend JavaScript
├── server.js       # Backend API server
├── package.json    # Dependencies
└── README.md       # This file
```
