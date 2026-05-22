# Email Setup Guide

## What We're Doing

Your website needs to send emails in three situations:

1. **Contact form submissions** → Emails go to Samantha/Lauren when someone fills out the contact form
2. **Newsletter signups** → Notification emails when someone subscribes
3. **Error alerts** → You get notified when a 404 or error happens on the site

## How Website Email Works

Websites can't send emails directly like you do from Gmail or Outlook. They need to connect to an **email server** (called SMTP) that actually sends the email on their behalf.

```
[Your Website] → [SMTP Server] → [Recipient's Inbox]
```

Think of it like this:
- Your website writes a letter
- SMTP is the post office that delivers it
- The recipient gets it in their inbox

## What is SMTP?

**SMTP** (Simple Mail Transfer Protocol) is the standard way computers send email. Every email provider has SMTP servers:

| Provider | SMTP Server | Port |
|----------|-------------|------|
| GoDaddy | smtpout.secureserver.net | 465 |
| Gmail | smtp.gmail.com | 465 |
| Outlook | smtp.office365.com | 587 |

To use an SMTP server, you need:
1. **Host** - The server address (e.g., `smtpout.secureserver.net`)
2. **Port** - The connection port (usually 465 or 587)
3. **Username** - Usually your full email address
4. **Password** - The password for that email account

## Your Setup

You have email through GoDaddy (the `@portergoldberg.com` addresses). We're configuring the website to send emails through GoDaddy's SMTP server.

### Required Environment Variables

Add these to your `.env.local` (for local development) and Vercel (for production):

```
SMTP_HOST=smtpout.secureserver.net
SMTP_PORT=465
SMTP_USER=info@portergoldberg.com
SMTP_PASS=<password for info@portergoldberg.com>
```

### Where to Find Your GoDaddy Email Password

1. Go to https://account.godaddy.com
2. Click **My Products**
3. Find **Email & Office** section
4. Click **Manage** next to your email plan
5. Find the email account (e.g., `info@portergoldberg.com`)
6. You can reset the password here if needed

**Important:** The password is whatever you (or Samantha/Lauren) use to log into that email account at https://email.godaddy.com

## Testing Locally

Before deploying to production, test locally:

1. Add the SMTP variables to `.env.local`
2. Run `npm run dev`
3. Go to the contact page and submit a test message
4. Check if the email arrives

## Alternative: Use Gmail for Testing

If you want to test without GoDaddy credentials, you can temporarily use a Gmail account:

1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Create an "App Password" (select "Mail" and "Mac")
4. Copy the 16-character password

Then use these settings:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=youremail@gmail.com
SMTP_PASS=<16-char app password>
```

## Production Deployment

Once tested locally, add the same variables to Vercel:

1. Go to https://vercel.com → Your Project → Settings → Environment Variables
2. Add each variable:
   - `SMTP_HOST` = `smtpout.secureserver.net`
   - `SMTP_PORT` = `465`
   - `SMTP_USER` = `info@portergoldberg.com`
   - `SMTP_PASS` = `<the password>`
3. Redeploy the site

## Previous Setup (Resend)

Previously, the site used **Resend** (a third-party email API service). It was giving 403 errors, likely due to API key issues. We switched to direct SMTP through GoDaddy since you already have email hosting there.

**Removed:**
- `resend` npm package
- `RESEND_API_KEY` environment variable
- `RESEND_FROM_EMAIL` environment variable

**Added:**
- `nodemailer` npm package
- SMTP environment variables (listed above)

## Troubleshooting

### "Missing SMTP_HOST environment variable"
You haven't set the SMTP variables in `.env.local` or Vercel.

### "Invalid login" or "Authentication failed"
The username or password is wrong. Double-check:
- Username should be the full email address
- Password should be the email account password (not your GoDaddy account password)

### Emails not arriving
1. Check spam folder
2. Verify the "to" email address is correct
3. Check Vercel logs for errors

### Still not working?
GoDaddy may require you to enable "SMTP relay" or "Less secure apps" in their email settings. Contact GoDaddy support if needed.
