# 🚀 Deployment Guide

Complete guide to deploying Pyro Timer to GitHub Pages, Vercel, Netlify, or other platforms.

## 📋 Table of Contents

- [GitHub Pages (Recommended)](#github-pages)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [Custom Domain Setup](#custom-domain)
- [Troubleshooting](#troubleshooting)

---

## GitHub Pages

### Automated Deployment (Recommended)

#### 1. Configure Base Path

Edit `vite.config.js` and set the `base` to your repository name:

```js
export default defineConfig({
  plugins: [react()],
  base: '/starcitizenhangers/', // ← Your GitHub repo name
})
```

#### 2. Install gh-pages

```bash
npm install --save-dev gh-pages
```

This is already included in `package.json`, so just run:

```bash
npm install
```

#### 3. Deploy

```bash
npm run deploy
```

This will:
1. Build your project (`npm run build`)
2. Deploy the `dist` folder to the `gh-pages` branch
3. Make your site live at `https://yourusername.github.io/starcitizenhangers/`

#### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: **gh-pages** / **root**
5. Save

Your site should be live in 1-2 minutes!

### Manual Deployment

If you prefer manual control:

```bash
# Build the project
npm run build

# Push dist folder to gh-pages branch
git subtree push --prefix dist origin gh-pages

# Or use this one-liner
npm run build && git subtree push --prefix dist origin gh-pages
```

---

## Vercel

### Automatic Deployment

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com)

3. Click **"New Project"**

4. Import your GitHub repository

5. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. Click **Deploy**

That's it! Vercel will:
- Auto-deploy on every push to `main`
- Provide a free `.vercel.app` domain
- Set up HTTPS automatically

### Custom Domain on Vercel

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

---

## Netlify

### Drag & Drop Deployment

Quickest method for testing:

```bash
npm run build
```

Then drag the `dist` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

### Automatic Deployment

1. Push your code to GitHub

2. Go to [netlify.com](https://netlify.com)

3. Click **"Add new site"** → **"Import an existing project"**

4. Connect your GitHub repository

5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

6. Click **Deploy site**

### Custom Domain on Netlify

1. In Netlify dashboard, go to your site
2. Domain settings → Add custom domain
3. Follow DNS configuration instructions

---

## Custom Domain

### Option 1: Using a Domain Registrar

Popular registrars for cheap domains:
- [Porkbun](https://porkbun.com) - ~$8-12/year, great for devs
- [Namecheap](https://namecheap.com) - ~$9-13/year
- [Cloudflare Registrar](https://cloudflare.com) - At-cost pricing

**Recommended domains:**
- `pyrotimer.com` (~$10/year)
- `sccztracker.com` (~$10/year)
- `starcitizentools.com` (~$12/year)

### Option 2: Free Subdomains

Get a free subdomain from:
- [Freenom](https://freenom.com) - Free .tk, .ml, .ga domains
- [is-a.dev](https://is-a.dev) - Free `yourname.is-a.dev` for developers
- [js.org](https://js.org) - Free `yourname.js.org` for JS projects

### DNS Configuration for GitHub Pages

After purchasing a domain:

1. Create a file named `CNAME` in the `public` folder:
```
pyrotimer.com
```

2. In your domain registrar's DNS settings, add:

**For root domain (pyrotimer.com):**
```
Type: A
Host: @
Value: 185.199.108.153
```
```
Type: A
Host: @
Value: 185.199.109.153
```
```
Type: A
Host: @
Value: 185.199.110.153
```
```
Type: A
Host: @
Value: 185.199.111.153
```

**For www subdomain:**
```
Type: CNAME
Host: www
Value: yourusername.github.io
```

3. In GitHub repo settings:
   - Go to Settings → Pages
   - Custom domain: Enter your domain
   - Enforce HTTPS: ✅ Check this

DNS propagation takes 5-60 minutes.

---

## Environment Variables

If you need environment variables (e.g., for analytics):

### For Vite

Create `.env`:
```env
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

Access in code:
```js
const version = import.meta.env.VITE_APP_VERSION
```

### For GitHub Pages

Use GitHub Secrets:
1. Repository Settings → Secrets and variables → Actions
2. Add secrets
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

---

## Build Optimization

### Reduce Bundle Size

Already optimized in `vite.config.js`:
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
      }
    }
  }
}
```

### Additional Optimizations

Install:
```bash
npm install --save-dev vite-plugin-compression
```

Update `vite.config.js`:
```js
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip' }),
  ],
})
```

---

## Troubleshooting

### Issue: 404 on refresh in GitHub Pages

**Solution:** GitHub Pages doesn't support client-side routing by default.

Add `404.html` to `public` folder (copy of `index.html`):
```bash
cp public/index.html public/404.html
```

### Issue: Assets not loading

**Solution:** Check `base` path in `vite.config.js` matches your repo name.

### Issue: Old version still showing after deploy

**Solution:** Clear browser cache or hard refresh:
- Chrome/Edge: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Firefox: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

### Issue: Build fails with "out of memory"

**Solution:** Increase Node memory:
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Update `base` in `vite.config.js`
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Update GitHub repo URL in README and footer
- [ ] Add CNAME file if using custom domain
- [ ] Configure DNS records if using custom domain
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Enable HTTPS in GitHub Pages settings
- [ ] Add Google Analytics or Plausible if needed
- [ ] Create GitHub release/tag for version 1.0.0

---

## Monitoring & Analytics

### Free Options

**Plausible (Privacy-friendly):**
```html
<!-- Add to index.html -->
<script defer data-domain="pyrotimer.com" src="https://plausible.io/js/script.js"></script>
```

**Google Analytics 4:**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Cost Breakdown

| Platform | Hosting | Domain | SSL | Total/Year |
|----------|---------|--------|-----|------------|
| GitHub Pages | Free | $10-12 | Free | $10-12 |
| Vercel | Free | $10-12 | Free | $10-12 |
| Netlify | Free | $10-12 | Free | $10-12 |

**Recommended:** GitHub Pages + Porkbun domain = **$10/year**

---

## Next Steps

1. Choose a platform (recommend GitHub Pages for simplicity)
2. Deploy using automated script
3. Optional: Purchase custom domain
4. Share with the Star Citizen community!

Need help? [Open an issue](https://github.com/yourusername/starcitizenhangers/issues)

**Happy deploying!** 🚀
