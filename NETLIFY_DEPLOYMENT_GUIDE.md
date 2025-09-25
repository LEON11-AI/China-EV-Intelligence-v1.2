# Netlify 部署指南

## 项目已准备就绪

✅ 项目构建成功  
✅ Netlify配置文件已创建  
✅ 所有代码更改已提交  

## 部署步骤

### 方法一：拖拽部署（推荐）

1. **构建项目**（已完成）
   ```bash
   npm run build
   ```

2. **访问 Netlify**
   - 打开 [https://app.netlify.com/](https://app.netlify.com/)
   - 登录您的账户

3. **拖拽部署**
   - 在主页面找到 "Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"
   - 将项目根目录下的 `dist` 文件夹直接拖拽到该区域
   - Netlify会自动开始部署

4. **获取访问链接**
   - 部署完成后，您将获得一个 `.netlify.app` 域名
   - 例如：`https://amazing-site-123456.netlify.app`

### 方法二：Git连接部署

如果您在界面中看到Git相关选项：

1. **连接Git仓库**
   - 点击 "New site from Git" 或类似按钮
   - 选择 GitHub
   - 授权并选择 `China-EV-Intelligence-v1.2` 仓库

2. **配置构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `22`

3. **部署**
   - 点击 "Deploy site"
   - 等待构建完成

## 配置说明

我们的 `netlify.toml` 配置包含：

- **构建设置**: 自动使用 `npm run build` 构建项目
- **SPA重定向**: 所有路由重定向到 `index.html`
- **安全头**: 添加安全相关的HTTP头
- **缓存优化**: 静态资源长期缓存

## 环境变量配置

如果项目使用了环境变量，请在Netlify控制台中配置：

1. 进入站点设置
2. 找到 "Environment variables"
3. 添加必要的环境变量（如EmailJS配置）

## 自定义域名（可选）

部署成功后，您可以：

1. 在站点设置中添加自定义域名
2. 启用HTTPS（自动）
3. 配置DNS设置

## 故障排除

- **构建失败**: 检查Node.js版本和依赖
- **页面404**: 确认SPA重定向配置
- **资源加载失败**: 检查构建输出目录

---

**项目状态**: ✅ 已准备部署  
**构建目录**: `dist`  
**访问方式**: 拖拽 `dist` 文件夹到Netlify或连接Git仓库