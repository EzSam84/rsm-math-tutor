# RSM Math Tutor - Complete Setup Guide for Windows
## For Parents with No Technical Experience

This guide will walk you through setting up the AI-powered math tutor. **Total time: 15-20 minutes**

---

## 📋 What You'll Need:
- Windows laptop/PC
- Internet connection
- Email address (for creating free accounts)

---

## 🎯 Setup Steps

### **STEP 1: Get a Free Hugging Face Account** (2 minutes)

1. Go to: https://huggingface.co/join
2. Click "Sign up"
3. Enter your email and create a password
4. Verify your email (check inbox)
5. Log in to Hugging Face

**Get your API key:**
1. Once logged in, click your profile picture (top right)
2. Click "Settings"
3. Click "Access Tokens" on the left sidebar
4. Click "New token"
5. Name it: "RSM Math Tutor"
6. Select "Read" permission
7. Click "Generate"
8. **COPY THE TOKEN** - it looks like: `hf_xxxxxxxxxxxxxxxxxx`
9. Save it in a text file for now (you'll need it soon)


---

### **STEP 2: Get a Free Vercel Account** (2 minutes)

1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub" (easiest option)
3. If you don't have GitHub:
   - Click "Create an account" on GitHub
   - Enter email, password, username
   - Verify your email
   - Come back to Vercel and click "Continue with GitHub"
4. Allow Vercel to access your GitHub account (click "Authorize")

---

### **STEP 3: Install Git for Windows** (3 minutes)

1. Go to: https://git-scm.com/download/win
2. Download will start automatically
3. Run the installer
4. Click "Next" on all screens (default settings are fine)
5. Click "Install"
6. Click "Finish"

---

### **STEP 4: Install Node.js** (3 minutes)

1. Go to: https://nodejs.org
2. Download the "LTS" version (left button - should say "Recommended")
3. Run the installer
4. Click "Next" on all screens
5. Check the box that says "Automatically install necessary tools"
6. Click "Install"
7. Click "Finish"

---

### **STEP 5: Download and Prepare the Files** (2 minutes)

1. Download these 4 files I created (they should all be in your Downloads folder):
   - `rsm-math-app.html`
   - `package.json`
   - `vercel.json`
   - `api/tutor.js` (this will be in a folder called "api")

2. Create a new folder on your Desktop called "RSM-Math-Tutor"

3. Move all downloaded files into this folder:
   - The 3 files go in the main folder
   - Make sure there's an "api" folder with "tutor.js" inside it

Your folder should look like:
```
RSM-Math-Tutor/
  ├── rsm-math-app.html
  ├── package.json
  ├── vercel.json
  └── api/
      └── tutor.js
```

---

### **STEP 6: Open Command Prompt and Navigate to Folder** (2 minutes)

1. Press the Windows key (⊞) on your keyboard
2. Type: `cmd`
3. Press Enter (Command Prompt opens - black window)
4. Type this command EXACTLY (or copy-paste):
   ```
   cd Desktop\RSM-Math-Tutor
   ```
5. Press Enter

---

### **STEP 7: Install Vercel** (2 minutes)

1. In the Command Prompt window, type:
   ```
   npm install -g vercel
   ```
2. Press Enter
3. Wait for it to finish (you'll see text scrolling)
4. When it's done, you'll see the cursor blinking again

---

### **STEP 8: Deploy to Vercel** (3 minutes)

1. In Command Prompt, type:
   ```
   vercel
   ```
2. Press Enter

3. You'll see questions - answer like this:
   - "Set up and deploy"? → Press Enter (Yes)
   - "Which scope?" → Press Enter (your account)
   - "Link to existing project?" → Type `n` and press Enter (No)
   - "What's your project's name?" → Type `rsm-math-tutor` and press Enter
   - "In which directory is your code located?" → Press Enter (./)
   - "Want to modify settings?" → Type `n` and press Enter (No)

4. Wait for deployment (about 30 seconds)

5. You'll see: "Production: https://rsm-math-tutor-xxxxx.vercel.app"
   - **COPY THIS URL** - this is your app's website!

---

### **STEP 9: Add Your Hugging Face API Key to Vercel** (2 minutes)

1. Go to: https://vercel.com/dashboard
2. Click on your project: "rsm-math-tutor"
3. Click "Settings" (top menu)
4. Click "Environment Variables" (left sidebar)
5. Add a new variable:
   - **Name:** Type exactly: `HUGGINGFACE_API_KEY`
   - **Value:** Paste your Hugging Face token (from Step 1)
   - **Environment:** Leave "Production" checked
   - Click "Save"

---

### **STEP 10: Redeploy** (1 minute)

1. Go back to Command Prompt
2. Type:
   ```
   vercel --prod
   ```
3. Press Enter
4. Wait 30 seconds

---

## ✅ **YOU'RE DONE!**

### **How to Use:**

1. Go to the URL from Step 8: `https://rsm-math-tutor-xxxxx.vercel.app`
2. Bookmark this page!
3. Your child can now use it anytime
4. The AI tutor should work - click "Open AI Tutor" on any problem

---

## 💰 **Cost:**

- **Hugging Face:** FREE (10,000 requests/month)
- **Vercel:** FREE (100GB bandwidth/month)
- **Total:** $0/month

With typical use (1 hour/day), you'll stay well within free limits.

---

## 🔧 **Troubleshooting:**

### **"AI tutor offline - using backup"**
- Your API key might be wrong
- Go back to Step 9 and double-check the key
- Make sure you did Step 10 (redeploy)

### **Can't find Command Prompt**
- Press Windows key + R
- Type: `cmd`
- Press Enter

### **"npm is not recognized"**
- Node.js didn't install correctly
- Restart your computer
- Try Step 4 again

### **Need Help?**
- Take a screenshot of any error messages
- Check the error in Command Prompt carefully
- Common issues are usually typos in the API key

---

## 📱 **Accessing on Other Devices:**

Once set up:
- **On phone/tablet:** Just go to your Vercel URL
- **On school computer:** Same URL works everywhere
- **No installation needed** - it's a website!

---

## 🎓 **What Your Child Gets:**

✅ Real AI tutor using Meta's Llama model (open-source)
✅ Follows RSM teaching methods (Socratic questioning)
✅ Works on any device with internet
✅ Completely free
✅ Private (your data stays with you)
✅ No ads, no tracking

---

**You did it! 🎉 Your child now has an AI math tutor!**
