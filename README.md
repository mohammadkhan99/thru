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

1. **EMAIL_USER** - Your Gmail address (e.g., `your-email@gmail.com`)
2. **EMAIL_PASS** - Your Gmail App Password (see Gmail Setup below)
3. **RECIPIENT_EMAIL** - Email to receive waitlist signups (defaults to `mohammad@k2studio.co` if not set)
   - For testing: `mohammad@k2studio.co`
   - For production: `joey@comethru.co`

### Gmail Setup
1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords
3. Use your Gmail address and the generated app password in Vercel environment variables

### Alternative Email Services
You can modify the transporter configuration in `api/waitlist.js` to use other email services (SendGrid, Mailgun, etc.).

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
