# GimmyAI Donation System Setup Guide

## Overview

This guide will help you set up the donation system for GimmyAI using Stripe. The system is fully implemented and ready to use once you add your API keys.

## Environment Variables Required

Create a `.env` file in the root directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# UploadThing Configuration (existing)
UPLOADTHING_APP_ID=your_uploadthing_app_id
UPLOADTHING_TOKEN=your_uploadthing_token

# Server Configuration
PORT=3000
```

## Stripe Setup

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get Your API Keys**:
   - Go to Stripe Dashboard → Developers → API Keys
   - Copy your "Secret key" (starts with `sk_test_` for test mode)
3. **Set Up Webhooks**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - Set URL to: `https://your-domain.com/api/webhook`
   - Select event: `checkout.session.completed`
   - Copy the webhook signing secret (starts with `whsec_`)

## Firebase Setup

1. **Get Firebase Config**:
   - Go to Firebase Console → Project Settings → General
   - Scroll down to "Your apps" section
   - Copy the config values

## Features Implemented

### Frontend

- ✅ Donation button in navbar (desktop & mobile)
- ✅ Donation modal with amount validation
- ✅ Preset donation amounts ($5, $10, $25, $50, $100, $250)
- ✅ Custom amount input with $5 minimum validation
- ✅ Success page after donation
- ✅ Cancelled page if user cancels

### Backend

- ✅ `/api/donate` endpoint for creating Stripe sessions
- ✅ Webhook handler for successful payments
- ✅ Firestore integration for donation logging
- ✅ Amount validation (minimum $5 USD)
- ✅ Error handling and user feedback

### Database Schema

Donations are stored in Firestore with this structure:

```javascript
{
  uid: "user_id_or_anonymous",
  donationAmount: 25.00, // in dollars
  currency: "usd",
  stripeSessionId: "cs_xxx",
  timestamp: serverTimestamp()
}
```

## How to Use

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Add Environment Variables**: Copy the example above and fill in your actual values

3. **Start the Server**:

   ```bash
   node server.js
   ```

4. **Start the Frontend**:

   ```bash
   npm run dev
   ```

5. **Test the Donation Flow**:
   - Click the "💝 Donate" button in the navbar
   - Enter an amount (minimum $5)
   - Complete the Stripe checkout
   - Check the success page

## Security Features

- ✅ Server-side amount validation
- ✅ Webhook signature verification
- ✅ User authentication integration
- ✅ Secure API endpoints
- ✅ Environment variable protection

## Production Deployment

1. **Update Environment Variables**: Use production Stripe keys (`sk_live_` instead of `sk_test_`)
2. **Update Webhook URL**: Point to your production domain
3. **Enable HTTPS**: Required for Stripe webhooks
4. **Set Up Monitoring**: Monitor webhook events in Stripe dashboard

## Troubleshooting

- **Webhook Not Working**: Check that the webhook URL is accessible and HTTPS
- **Payment Not Recording**: Verify webhook secret and Firestore permissions
- **Modal Not Opening**: Check browser console for JavaScript errors
- **Validation Errors**: Ensure amount is at least $5 USD

## Support

The donation system is fully implemented and ready to use. Simply add your API keys and start accepting donations to keep GimmyAI free for students!

