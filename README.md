# RSM Math Tutor - File Summary

## What You're Getting:

### **Files to Download:**

1. **rsm-math-app.html** - The main math tutoring application
2. **api/tutor.js** - Backend serverless function (handles AI)
3. **package.json** - Configuration file
4. **vercel.json** - Deployment configuration
5. **SETUP-GUIDE.md** - Step-by-step setup instructions

### **How It Works:**

```
Student's Computer
       ↓
Opens rsm-math-app.html in browser
       ↓
Clicks "AI Tutor" button
       ↓
App sends question to Vercel (your backend)
       ↓
Vercel backend calls Hugging Face API
       ↓
Llama 3.2 AI generates tutoring response
       ↓
Response goes back through Vercel
       ↓
Shows in app for student
```

### **Why This Setup?**

- **Browser can't call AI APIs directly** (security - CORS)
- **Vercel backend acts as secure middleman**
- **Your API key stays secret** (on Vercel's servers, not in browser)
- **Everything is free** (using free tiers)

### **Tech Stack:**

- **Frontend:** HTML + React (runs in browser)
- **Backend:** Node.js serverless function (runs on Vercel)
- **AI Model:** Meta Llama 3.2 3B (via Hugging Face)
- **Hosting:** Vercel (free tier)

### **Free Tier Limits:**

- **Hugging Face:** 10,000 API calls/month
- **Vercel:** 100GB bandwidth/month
- **Typical usage:** ~100-500 calls/month (1 hour/day)
- **You'll stay well within limits!**

### **Quick Start:**

1. Read SETUP-GUIDE.md
2. Follow steps 1-10
3. Bookmark your Vercel URL
4. Start learning!

### **Support:**

If something doesn't work:
1. Check SETUP-GUIDE.md troubleshooting section
2. Make sure API key is correct
3. Verify you redeployed after adding key (Step 10)
4. Look for error messages in browser console (F12)

---

**That's it! Everything you need to get the AI tutor running for free.**
