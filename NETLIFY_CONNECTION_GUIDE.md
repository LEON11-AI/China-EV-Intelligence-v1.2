# Netlify Connection and Deployment Guide

## 📋 Pre-deployment Checklist

✅ Project built successfully (`npm run build`)
✅ Code pushed to GitHub repository: `leon11-ai/China-EV-Intelligence-v1.2`
✅ Netlify configuration file `netlify.toml` ready

## 🚀 Netlify Deployment Steps

### Step 1: Access Netlify Website

1. Open your browser and visit [https://www.netlify.com](https://www.netlify.com)
2. If you don't have an account, click **"Sign up"** to register
3. If you already have an account, click **"Log in"** to sign in

### Step 2: Create New Site

#### Method 1: Connect via Git (Recommended)

1. After logging in, look for one of the following buttons on the Netlify dashboard:
   - **"Add new site"** button (usually in the top right)
   - **"Import from Git"** button
   - **"New site from Git"** button
   - Or click the **"+"** icon directly

2. If the interface layout is different, look for similar options:
   - **"Add new site"** in the **"Sites"** tab
   - **"Deploy"** related buttons

### Step 3: Connect GitHub Account

1. On the create new site page, select **"GitHub"** as your Git provider
2. If this is your first time, you'll need to authorize Netlify to access your GitHub account
3. Click **"Authorize Netlify"** to complete authorization

### Step 4: Select Repository

1. Find **`leon11-ai/China-EV-Intelligence-v1.2`** in the repository list
2. If you can't see the repository, you can:
   - Use the search box to search for "China-EV-Intelligence"
   - Check if the repository is public
   - Click **"Configure Netlify on GitHub"** to reconfigure permissions

3. Once you find the repository, click on the repository name to select it

### Step 5: Configure Build Settings

On the deployment configuration page, confirm the following settings:

```
Branch: main
Build command: npm run build
Publish directory: dist
Node.js version: 22
```

**Important Note:** These settings should be automatically read from the `netlify.toml` file. If they're not auto-filled, please manually enter the above values.

### Step 6: Start Deployment

1. After confirming all settings are correct, click the **"Deploy site"** button
2. Netlify will start the build and deployment process
3. The build process takes approximately 2-5 minutes

### Step 7: Get Access Link

1. After deployment is complete, Netlify will generate a random site name in the format:
   ```
   https://amazing-cupcake-123456.netlify.app
   ```

2. You can customize the domain name in site settings:
   - Click **"Site settings"**
   - Select **"Change site name"**
   - Enter a custom name (e.g., china-ev-intelligence)

## 🔧 Troubleshooting

### If You Can't Find the "New site from Git" Button

**Possible button locations in the new Netlify interface:**

1. **Main Dashboard:**
   - Look for the **"Add new site"** dropdown menu
   - Select **"Import an existing project"**

2. **Sites Page:**
   - Click **"Sites"** in the left navigation
   - Look for the **"Add new site"** button
   - Or the **"Import from Git"** option

3. **Direct Access:**
   - Visit [https://app.netlify.com/start](https://app.netlify.com/start)
   - This will directly take you to the create new site page

### Alternative Deployment Method: Manual Drag & Drop

If Git connection encounters issues, you can use manual deployment:

1. Run `npm run build` locally to generate the `dist` folder
2. In the Netlify console, select **"Deploy manually"**
3. Drag the `dist` folder to the designated area
4. Wait for upload and deployment to complete

## 📊 Deployment Status Check

After deployment is complete, you can:

1. **View deployment logs:** Check if the build process was successful
2. **Test website functionality:** Ensure all pages and features work properly
3. **Check email subscription:** Verify EmailJS configuration is correct

## 🌐 Final Access Methods

After successful deployment, your project will be accessible via:

- **Netlify Site:** `https://your-site-name.netlify.app`
- **GitHub Pages:** `https://leon11-ai.github.io/China-EV-Intelligence-v1.2/`
- **Local Development:** `http://localhost:5173`

## 📞 Need Help?

If you encounter any issues during deployment, please provide:
1. Specific error messages
2. Screenshots of the current interface
3. Description of the steps taken

I'll provide further assistance!