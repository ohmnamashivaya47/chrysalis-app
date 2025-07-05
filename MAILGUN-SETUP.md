# 📧 Mailgun Domain Setup Guide

## Quick Steps to Get Your Mailgun Domain

### 1. Go to Mailgun Dashboard
- Visit: https://app.mailgun.com/app/domains
- Login with your Mailgun account

### 2. Add New Domain
- Click "Add New Domain"
- Use: `mg.chrysalis-meditation.app` (or any subdomain you prefer)
- Choose "US" region (cheaper)

### 3. Verify Domain
- Follow the DNS setup instructions
- Usually takes 5-10 minutes to verify

### 4. Get Your Domain Name
- Copy the domain name (like: `sandbox-abc123.mailgun.org`)
- Add to your environment variables:

```env
MAILGUN_DOMAIN=sandbox-abc123.mailgun.org
```

### Alternative: Use Sandbox Domain
If you want to test immediately, you can use the default sandbox domain that's already provided in your Mailgun account. Look for something like:
`sandbox-[random-string].mailgun.org`

## 🚀 Once You Have the Domain
Update your .env file with:
```env
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your-domain-here
```
