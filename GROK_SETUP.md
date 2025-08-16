# Grok API Setup Guide

## 🚀 **Getting Started with Grok AI**

This application now uses **Grok AI** (xAI's advanced AI model) instead of OpenAI for generating meeting summaries.

## 📋 **Prerequisites**

1. **xAI Account**: You need an account on [xAI Platform](https://console.x.ai/)
2. **API Access**: Grok API access (may require approval)
3. **Credits**: Sufficient credits in your xAI account

## 🔑 **Getting Your Grok API Key**

### Step 1: Visit xAI Console
- Go to [https://console.x.ai/](https://console.x.ai/)
- Sign in to your xAI account

### Step 2: Navigate to API Keys
- Look for "API Keys" or "Developer" section
- Click on "Create New API Key"

### Step 3: Generate API Key
- Give your key a descriptive name (e.g., "Notes Summariser")
- Copy the generated API key (starts with `xai_`)

## ⚙️ **Environment Configuration**

1. **Copy the environment template:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file with your Grok API key:**
   ```env
   # Grok API Configuration
   GROK_API_KEY=xai_your_actual_api_key_here
   GROK_API_URL=https://api.x.ai/v1
   GROK_MODEL=grok-beta
   GROK_MAX_TOKENS=1000
   GROK_TEMPERATURE=0.7
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   ```

## 🔧 **Configuration Options**

### **GROK_MODEL**
- `grok-beta` - Latest Grok model (recommended)
- `grok-alpha` - Alternative model option

### **GROK_MAX_TOKENS**
- Controls the maximum length of generated summaries
- Range: 100-4000 tokens
- Default: 1000 (good for most summaries)

### **GROK_TEMPERATURE**
- Controls creativity vs. focus
- Range: 0.0 (focused) to 1.0 (creative)
- Default: 0.7 (balanced)

## 🧪 **Testing Your Setup**

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Check backend logs** for any Grok API errors
3. **Try generating a summary** with a short transcript
4. **Monitor API usage** in your xAI console

## ❗ **Common Issues**

### **API Key Invalid (401)**
- Verify your API key is correct
- Check if the key is active in xAI console
- Ensure you have sufficient credits

### **Rate Limit Exceeded (429)**
- Grok API has rate limits
- Wait a few minutes and try again
- Consider upgrading your xAI plan

### **Model Not Found (400)**
- Verify `GROK_MODEL` is correct
- Check xAI documentation for available models
- Ensure your account has access to the model

## 💰 **Pricing & Limits**

- **Pricing**: Check [xAI pricing page](https://x.ai/pricing)
- **Rate Limits**: Varies by plan
- **Token Limits**: Depends on your subscription

## 🔗 **Useful Links**

- [xAI Console](https://console.x.ai/)
- [Grok API Documentation](https://docs.x.ai/)
- [xAI Pricing](https://x.ai/pricing)
- [API Status](https://status.x.ai/)

## 🆘 **Need Help?**

1. Check xAI console for API usage and errors
2. Review backend logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure your xAI account has API access enabled
