# Complete Setup Guide 🚀

## Clone & Install Your Voice Agent

### Prerequisites
- **Git** installed ([download](https://git-scm.com/downloads))
- **Node.js 16+** installed ([download](https://nodejs.org/))
- **npm** (comes with Node.js)

Verify you have them:
```bash
git --version
node --version
npm --version
```

---

## Step 1: Clone the Repository

Open your terminal/command prompt and run:

```bash
git clone https://github.com/bnagasuman-source/voice-agenet.git
```

This creates a `voice-agenet` folder with all the project files.

Navigate into it:

```bash
cd voice-agenet
```

You should now see all the files like `package.json`, `README.md`, etc.

---

## Step 2: Verify Project Structure

Check that everything is there:

```bash
ls -la
```

You should see:
```
src/
package.json
README.md
.env.example
.gitignore
```

---

## Step 3: Install Dependencies

Install all required packages using npm:

```bash
npm install
```

This reads `package.json` and installs all libraries into `node_modules/` folder.

**Expected output:**
```
added 200 packages, and audited 201 packages in 3s
```

Wait for it to complete. This may take 1-2 minutes.

---

## Step 4: Create Your Environment File

Copy the example file:

### **On Mac/Linux:**
```bash
cp .env.example .env
```

### **On Windows (Command Prompt):**
```bash
copy .env.example .env
```

### **On Windows (PowerShell):**
```bash
Copy-Item .env.example .env
```

Now you have a `.env` file in your project.

---

## Step 5: Get Your API Credentials

### **A. Twilio Credentials**

1. Go to https://console.twilio.com
2. Sign up (free trial gives you $15 credit)
3. Look for **Account SID** and **Auth Token** (under "Account")
4. Copy both values

5. Go to **Phone Numbers** → **Manage** → **Get Numbers**
6. Choose a phone number (US numbers are free for trial)
7. Copy your new Twilio phone number (format: `+1234567890`)

### **B. OpenAI API Key**

1. Go to https://platform.openai.com/account/api-keys
2. Sign up (free trial gives you $5 credit)
3. Click **"Create new secret key"**
4. Copy the entire key (starts with `sk-`)
5. **SAVE IT SECURELY** - you won't see it again!

---

## Step 6: Configure the .env File

Open `.env` file in your editor and fill in your credentials:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# OpenAI Configuration
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Webhook Base URL (for production/ngrok)
WEBHOOK_URL=https://your-domain.com

# Logging
LOG_LEVEL=info

# Call Configuration
MAX_CALL_DURATION=3600
RESPONSE_TIMEOUT=10000
VOICE_TYPE=Polly.Amy
LANGUAGE=en-US
```

**Replace these with YOUR actual values:**
- `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` → Your Twilio Account SID
- `your_auth_token_here` → Your Twilio Auth Token
- `+1234567890` → Your Twilio Phone Number
- `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` → Your OpenAI API Key

**Save the file** (Ctrl+S or Cmd+S)

---

## Step 7: Start the Development Server

Now run the server:

```bash
npm start
```

You should see output like:
```
🎙️  Voice Agent running on port 3000
Model: gpt-4
Phone: +1234567890

📱 Local testing: ngrok http 3000
```

**Keep this terminal window open!**

---

## Step 8: Setup ngrok for Local Testing

Open a **new terminal window** (keep the first one running):

### **A. Install ngrok**

Go to https://ngrok.com and download for your OS.

Extract it and open the folder, then run:

```bash
ngrok http 3000
```

You'll see output like:
```
Session Status                online
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the URL:** `https://abc123.ngrok.io`

**Keep this terminal open too!**

---

## Step 9: Configure Twilio Webhook

1. Go to https://console.twilio.com/phone-numbers/verified
2. Click your phone number
3. Under **"Incoming Calls"**, set webhook to:
   ```
   https://abc123.ngrok.io/voice
   ```
   (Replace `abc123` with your actual ngrok URL)
4. Click **Save**

---

## Step 10: Test Your Voice Agent

Pick up your phone and **call your Twilio number**!

You should hear:
> "Hello! I'm an AI voice assistant. How can I help you today?"

Speak something like:
> "What's the weather today?"

The agent should respond naturally! 🎉

---

## Troubleshooting

### Issue: `npm: command not found`
**Solution:** Node.js isn't installed. Download from https://nodejs.org/

### Issue: Cannot find module 'express'
**Solution:** Run `npm install` again

### Issue: No incoming calls to my number
**Solution:**
1. Check ngrok is still running (don't close the terminal)
2. Check the Twilio webhook URL matches your ngrok URL
3. Make sure `.env` has correct credentials

### Issue: Agent not responding
**Solution:**
1. Check OpenAI API key is correct
2. Verify account has credits (go to OpenAI dashboard)
3. Check server logs in first terminal

### Issue: "Error: ENOENT: no such file or directory, open '.env'"
**Solution:** You forgot to create `.env`. Run: `cp .env.example .env`

---

## Quick Reference Commands

| Command | What it does |
|---------|-------------|
| `git clone ...` | Download project |
| `cd voice-agenet` | Open project folder |
| `npm install` | Install dependencies |
| `cp .env.example .env` | Create config file |
| `npm start` | Start server |
| `ngrok http 3000` | Create tunnel (new terminal) |

---

## Next Steps

Once it's working:
1. **Customize personality** - Edit `systemPrompt` in `src/index.js`
2. **Deploy to production** - Use Heroku or AWS
3. **Add features** - Integrate with calendars, CRM, etc.

---

**Need help?** Open an issue: https://github.com/bnagasuman-source/voice-agenet/issues

Good luck! 🚀
