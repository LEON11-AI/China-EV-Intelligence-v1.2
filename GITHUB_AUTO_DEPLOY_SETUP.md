# GitHub Actions 自动部署设置指南

## 🔍 为什么需要手动部署？

您的项目**已经配置了GitHub Actions自动部署**，但目前需要手动部署的原因是：

### 1. GitHub Secrets 未配置
项目中的 `.github/workflows/deploy.yml` 文件需要以下密钥才能正常工作：
- `NETLIFY_AUTH_TOKEN` - Netlify 认证令牌
- `NETLIFY_SITE_ID` - Netlify 站点ID
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS 公钥
- `VITE_EMAILJS_SERVICE_ID` - EmailJS 服务ID
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS 模板ID

### 2. Netlify 站点未连接到 GitHub
如果 Netlify 站点是通过手动拖拽创建的，它不会自动监听 GitHub 仓库的变化。

## 🚀 设置自动部署的完整步骤

### 方法一：通过 GitHub Actions + Netlify API（推荐）

#### 步骤 1: 获取 Netlify 认证信息

1. **获取 Netlify Auth Token：**
   - 登录 [Netlify](https://app.netlify.com)
   - 点击右上角头像 → **User settings**
   - 选择 **Applications** 标签
   - 点击 **New access token**
   - 输入描述（如："GitHub Actions Deploy"）
   - 复制生成的 token

2. **获取 Netlify Site ID：**
   - 进入您的 Netlify 站点控制台
   - 点击 **Site settings**
   - 在 **General** 标签下找到 **Site information**
   - 复制 **Site ID**

#### 步骤 2: 在 GitHub 仓库中配置 Secrets

1. 访问您的 GitHub 仓库：`https://github.com/leon11-ai/China-EV-Intelligence-v1.2`
2. 点击 **Settings** 标签
3. 在左侧菜单中选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 添加以下密钥：

```
名称: NETLIFY_AUTH_TOKEN
值: [您在步骤1中获取的 Netlify Auth Token]

名称: NETLIFY_SITE_ID
值: [您在步骤1中获取的 Netlify Site ID]

名称: VITE_EMAILJS_PUBLIC_KEY
值: [您的 EmailJS 公钥]

名称: VITE_EMAILJS_SERVICE_ID
值: [您的 EmailJS 服务ID]

名称: VITE_EMAILJS_TEMPLATE_ID
值: [您的 EmailJS 模板ID]
```

#### 步骤 3: 测试自动部署

1. 对项目进行任意修改（如更新 README.md）
2. 提交并推送到 main 分支：
   ```bash
   git add .
   git commit -m "test: 测试自动部署"
   git push origin main
   ```
3. 在 GitHub 仓库中查看 **Actions** 标签，确认工作流正在运行
4. 等待部署完成（通常 3-5 分钟）

### 方法二：直接连接 Netlify 到 GitHub（更简单）

#### 步骤 1: 重新创建 Netlify 站点

1. 登录 [Netlify](https://app.netlify.com)
2. 点击 **Add new site** → **Import an existing project**
3. 选择 **GitHub** 作为 Git 提供商
4. 授权 Netlify 访问您的 GitHub 账户
5. 选择 `leon11-ai/China-EV-Intelligence-v1.2` 仓库
6. 配置构建设置：
   ```
   Branch: main
   Build command: npm run build
   Publish directory: dist
   ```
7. 点击 **Deploy site**

#### 步骤 2: 配置环境变量

1. 在 Netlify 站点控制台中，点击 **Site settings**
2. 选择 **Environment variables**
3. 添加以下环境变量：
   ```
   VITE_EMAILJS_PUBLIC_KEY = [您的 EmailJS 公钥]
   VITE_EMAILJS_SERVICE_ID = [您的 EmailJS 服务ID]
   VITE_EMAILJS_TEMPLATE_ID = [您的 EmailJS 模板ID]
   ```

#### 步骤 3: 享受自动部署

现在每次您推送代码到 main 分支时，Netlify 会自动：
1. 检测到代码变化
2. 拉取最新代码
3. 运行构建命令
4. 部署新版本

## 🔧 故障排除

### GitHub Actions 部署失败

1. **检查 Secrets 配置：**
   - 确保所有必需的 secrets 都已正确添加
   - 验证 Netlify Auth Token 和 Site ID 的正确性

2. **查看构建日志：**
   - 在 GitHub 仓库的 **Actions** 标签中查看详细错误信息
   - 常见问题包括依赖安装失败、构建命令错误等

3. **更新 Node.js 版本：**
   如果遇到 Node.js 版本问题，可以更新 `.github/workflows/deploy.yml` 中的版本：
   ```yaml
   - name: Set up Node.js
     uses: actions/setup-node@v3
     with:
       node-version: '22' # 更新为最新版本
   ```

### Netlify 直连部署失败

1. **检查构建设置：**
   - 确认构建命令为 `npm run build`
   - 确认发布目录为 `dist`
   - 确认分支为 `main`

2. **检查环境变量：**
   - 确保所有 EmailJS 相关的环境变量都已正确配置
   - 变量名必须以 `VITE_` 开头

## 📊 推荐方案

**对于您的项目，我推荐使用方法二（直接连接 Netlify 到 GitHub）**，因为：

✅ **设置更简单** - 无需配置复杂的 GitHub Secrets
✅ **管理更方便** - 所有配置都在 Netlify 控制台中
✅ **调试更容易** - 可以直接在 Netlify 中查看构建日志
✅ **功能更丰富** - 支持分支预览、回滚等高级功能

## 🎯 下一步操作

1. **选择您偏好的方法**（推荐方法二）
2. **按照步骤配置自动部署**
3. **测试自动部署功能**
4. **享受无缝的开发体验**

配置完成后，您只需要：
```bash
git add .
git commit -m "您的提交信息"
git push origin main
```

网站就会自动更新！🚀