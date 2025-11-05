# ⚡ Quick Start Guide

Get Pyro Timer running in 5 minutes!

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# Visit: http://localhost:5173
```

That's it! The app is now running locally.

## 📦 Deploy to GitHub Pages

### One-Time Setup

1. **Update repository name** in `vite.config.js`:
   ```js
   base: '/',  // Use '/' for custom domain, or '/repo-name/' for GitHub Pages subdomain
   ```

2. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/RedBeret/ExecutiveHangerTimers.git
   git push -u origin main
   ```

### Deploy

```bash
npm run deploy
```

Your site will be live at: `https://cztimer.com`

## 🌐 Custom Domain (Optional)

### Buy a Domain
- **Recommended:** [Porkbun](https://porkbun.com) - $10/year
- **Suggested:** `pyrotimer.com`, `sccztracker.com`

### Configure DNS

1. Create `public/CNAME` file:
   ```
   pyrotimer.com
   ```

2. Add DNS records at your registrar:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153

   Type: A
   Host: @
   Value: 185.199.109.153

   Type: A
   Host: @
   Value: 185.199.110.153

   Type: A
   Host: @
   Value: 185.199.111.153

   Type: CNAME
   Host: www
   Value: redberet.github.io
   ```

3. In GitHub repo settings:
   - Settings → Pages
   - Custom domain: `pyrotimer.com`
   - ✅ Enforce HTTPS

Wait 5-60 minutes for DNS propagation.

## ✅ Verification Checklist

- [ ] `npm run dev` works locally
- [ ] Executive hangar timer shows current phase
- [ ] Timers can be started and reset
- [ ] Compboards can be checked/unchecked
- [ ] Data persists after page refresh
- [ ] `npm run build` completes without errors
- [ ] `npm run deploy` publishes to GitHub Pages

## 🐛 Common Issues

### ❌ Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ❌ Site shows 404 after deploy
- Check `base` path in `vite.config.js` matches repo name
- Verify GitHub Pages is enabled (Settings → Pages)
- Wait a few minutes for deployment to complete

### ❌ Timers don't persist
- Check browser allows localStorage
- Try in a different browser
- Check browser console for errors

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [LICENSE](LICENSE) for usage terms
- Star the repo on GitHub if you find it useful!

## 🎮 Using the App

1. **Executive Hangar:**
   - Runs automatically, shows current phase
   - Watch for GREEN phase to insert boards

2. **Contested Zone Timers:**
   - Click "Start" when using a keycard printer
   - 30-minute cooldown countdown

3. **Vault Timer:**
   - Click "Door Opened Now" when you see it open
   - Tracks 1min open / 20min closed cycle

4. **Compboard Checklist:**
   - Click to mark boards as collected
   - Tracks progress toward 7/7

## 💡 Pro Tips

- Keep your system clock auto-synced for accuracy
- Bookmark the site for quick access during gameplay
- Use on a second monitor while playing
- Share the link with your org!

---

**Need help?** Open an issue on GitHub

**May your hangars always be green!** 🚀
