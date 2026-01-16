# Testing the Waitlist Email

## Quick Test Steps

1. **Make sure you have these in Vercel Environment Variables:**
   - `RESEND_API_KEY` - Your Resend API key
   - `RECIPIENT_EMAIL` - Set to `mohammad@k2studio.co` for testing

2. **Test the form:**
   - Go to your deployed site (e.g., `https://your-site.vercel.app`)
   - Click "Request Early Access"
   - Enter a test email (like `test@example.com`)
   - Click "Send"
   - You should receive an email at `mohammad@k2studio.co`

3. **Check Vercel logs if it doesn't work:**
   - Go to Vercel Dashboard → Your Project → Functions → View Logs
   - Look for any error messages

## Common Issues

- **No email received:** Check that `RESEND_API_KEY` is set correctly in Vercel
- **Error message:** Check Vercel function logs for details
- **Form not submitting:** Check browser console for errors

## Testing Locally

If you want to test locally first:

1. Create a `.env` file:
```
RESEND_API_KEY=your_api_key_here
RECIPIENT_EMAIL=mohammad@k2studio.co
```

2. Run the server:
```bash
npm run dev
```

3. Test at `http://localhost:3000`
