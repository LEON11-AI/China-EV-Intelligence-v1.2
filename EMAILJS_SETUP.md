# EmailJS Setup Guide

This project uses EmailJS for handling newsletter subscriptions. Follow these steps to configure EmailJS:

## 1. Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Create Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## 3. Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: Welcome to China EV Intelligence Newsletter!

Hi there,

Thank you for subscribing to China EV Intelligence newsletter!

You'll now receive the latest insights, analysis, and trends about China's electric vehicle industry directly in your inbox.

Best regards,
China EV Intelligence Team

Email: {{to_email}}
From: {{from_name}}
Message: {{message}}
```

4. Save the template and note down your **Template ID**

## 4. Get Public Key

1. Go to "Account" > "General"
2. Find your **Public Key**

## 5. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your EmailJS credentials:
   ```
   VITE_EMAILJS_SERVICE_ID=your_actual_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
   ```

## 6. Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the homepage
3. Try subscribing with your email address
4. Check if you receive the confirmation email

## Troubleshooting

- Make sure your `.env` file is in the project root
- Verify that all environment variables are correctly set
- Check the browser console for any error messages
- Ensure your EmailJS service is active and properly configured

## Security Notes

- Never commit your `.env` file to version control
- The `.env.example` file shows the required variables without actual values
- EmailJS public key is safe to use in frontend applications