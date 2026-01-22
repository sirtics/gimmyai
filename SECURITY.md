# Security Documentation

## Overview
This document outlines the security measures implemented in GimmyAI to protect user data and prevent common vulnerabilities.

## Security Features

### 1. API Key Protection
- **OpenAI API Key**: Moved to server-side to prevent exposure in client-side code
- **Environment Variables**: All sensitive keys stored in `.env` files (gitignored)
- **Server-Side Processing**: All AI API calls are processed through `/api/chat` endpoint

### 2. Input Validation & Sanitization
- **Client-Side Validation**: All user inputs are validated before submission
- **Server-Side Validation**: Additional validation on server endpoints
- **XSS Prevention**: Input sanitization removes script tags and dangerous HTML
- **Injection Prevention**: Pattern detection for SQL/NoSQL injection attempts
- **Spam Detection**: Repetition-based spam detection in messages

### 3. Rate Limiting
- **Client-Side**: 
  - Messages: 10 per minute, 100 per hour
  - API calls: 20 per minute, 200 per hour
- **Server-Side**:
  - Chat API: 20 requests per minute
  - Donation API: 10 requests per minute
  - Webhook: 100 requests per minute

### 4. Authentication & Authorization
- **Firebase Authentication**: Secure user authentication
- **Firestore Security Rules**: Users can only access their own data
- **Storage Security Rules**: Users can only upload to their own folders
- **Input Validation**: Email and password validation with sanitization

### 5. Security Headers
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Content-Security-Policy` - Restricts resource loading
- `Strict-Transport-Security` - Forces HTTPS in production

### 6. Error Handling
- **Information Leakage Prevention**: Generic error messages that don't reveal system details
- **Email Enumeration Prevention**: Password reset always shows success message
- **User-Friendly Messages**: Clear error messages without exposing technical details

### 7. Firebase Security Rules

#### Firestore Rules
- Users can only read/write their own conversations
- Users can only read their own donations
- Server-side writes only for donations

#### Storage Rules
- Users can only upload to their own folder (`/uploads/{userId}/`)
- File size limit: 10MB
- Allowed file types: images, PDFs, text files

## Environment Variables

### Required Server Variables
```env
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
UPLOADTHING_APP_ID=your_uploadthing_app_id
UPLOADTHING_TOKEN=your_uploadthing_token
```

### Required Client Variables
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Deployment Checklist

- [ ] All environment variables set in production
- [ ] Firebase security rules deployed
- [ ] Storage security rules deployed
- [ ] HTTPS enabled
- [ ] CORS configured for production domain
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] Error logging configured (without exposing sensitive data)
- [ ] Regular security updates for dependencies

## Reporting Security Issues

If you discover a security vulnerability, please email security@gimmyai.com (or your security contact) instead of using the public issue tracker.

## Security Best Practices

1. **Never commit `.env` files** - Always use environment variables
2. **Keep dependencies updated** - Regularly update npm packages
3. **Monitor rate limits** - Watch for unusual activity patterns
4. **Review Firebase rules** - Regularly audit security rules
5. **Use HTTPS** - Always use HTTPS in production
6. **Validate all inputs** - Both client and server-side
7. **Sanitize outputs** - Prevent XSS attacks
8. **Limit error information** - Don't expose system details in errors
