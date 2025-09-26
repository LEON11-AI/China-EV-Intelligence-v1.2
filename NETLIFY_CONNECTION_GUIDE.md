# Netlify 连接部署详细指南

## 📋 部署前准备

✅ 项目已构建成功 (`npm run build`)
✅ 代码已推送到 GitHub 仓库: `leon11-ai/China-EV-Intelligence-v1.2`
✅ Netlify 配置文件 `netlify.toml` 已准备就绪

## 🚀 Netlify 部署步骤

### 步骤 1: 访问 Netlify 网站

1. 打开浏览器，访问 [https://www.netlify.com](https://www.netlify.com)
2. 如果没有账户，点击 **"Sign up"** 注册
3. 如果已有账户，点击 **"Log in"** 登录

### 步骤 2: 创建新站点

#### 方法一：通过 Git 连接（推荐）

1. 登录后，在 Netlify 控制台主页面查找以下按钮之一：
   - **"Add new site"** 按钮（通常在右上角）
   - **"Import from Git"** 按钮
   - **"New site from Git"** 按钮
   - 或者直接点击 **"+"** 号图标

2. 如果界面布局不同，寻找类似的选项：
   - **"Sites"** 标签页中的 **"Add new site"**
   - **"Deploy"** 相关的按钮

### 步骤 3: 连接 GitHub 账户

1. 在创建新站点页面，选择 **"GitHub"** 作为 Git 提供商
2. 如果首次使用，需要授权 Netlify 访问您的 GitHub 账户
3. 点击 **"Authorize Netlify"** 完成授权

### 步骤 4: 选择仓库

1. 在仓库列表中找到 **`leon11-ai/China-EV-Intelligence-v1.2`**
2. 如果看不到仓库，可以：
   - 使用搜索框搜索 "China-EV-Intelligence"
   - 检查仓库是否为公开状态
   - 点击 **"Configure Netlify on GitHub"** 重新配置权限

3. 找到仓库后，点击仓库名称选择它

### 步骤 5: 配置构建设置

在部署配置页面，确认以下设置：

```
分支 (Branch): main
构建命令 (Build command): npm run build
发布目录 (Publish directory): dist
Node.js 版本: 22
```

**重要提示：** 这些设置应该会自动从 `netlify.toml` 文件中读取，如果没有自动填充，请手动输入上述值。

### 步骤 6: 开始部署

1. 确认所有设置正确后，点击 **"Deploy site"** 按钮
2. Netlify 将开始构建和部署过程
3. 构建过程大约需要 2-5 分钟

### 步骤 7: 获取访问链接

1. 部署完成后，Netlify 会生成一个随机的站点名称，格式如：
   ```
   https://amazing-cupcake-123456.netlify.app
   ```

2. 您可以在站点设置中自定义域名：
   - 点击 **"Site settings"**
   - 选择 **"Change site name"**
   - 输入自定义名称（如：china-ev-intelligence）

## 🔧 故障排除

### 如果找不到 "New site from Git" 按钮

**新版 Netlify 界面可能的按钮位置：**

1. **主控制台页面：**
   - 查找 **"Add new site"** 下拉菜单
   - 选择 **"Import an existing project"**

2. **Sites 页面：**
   - 点击左侧导航的 **"Sites"**
   - 查找 **"Add new site"** 按钮
   - 或者 **"Import from Git"** 选项

3. **直接访问：**
   - 访问 [https://app.netlify.com/start](https://app.netlify.com/start)
   - 这会直接跳转到创建新站点页面

### 替代部署方法：手动拖拽

如果 Git 连接遇到问题，可以使用手动部署：

1. 在本地运行 `npm run build` 生成 `dist` 文件夹
2. 在 Netlify 控制台选择 **"Deploy manually"**
3. 将 `dist` 文件夹拖拽到指定区域
4. 等待上传和部署完成

## 📊 部署状态检查

部署完成后，您可以：

1. **查看部署日志：** 检查构建过程是否成功
2. **测试网站功能：** 确保所有页面和功能正常工作
3. **检查邮件订阅：** 验证 EmailJS 配置是否正确

## 🌐 最终访问方式

部署成功后，您的项目将可以通过以下方式访问：

- **Netlify 站点：** `https://your-site-name.netlify.app`
- **GitHub Pages：** `https://leon11-ai.github.io/China-EV-Intelligence-v1.2/`
- **本地开发：** `http://localhost:5173`

## 📞 需要帮助？

如果在部署过程中遇到任何问题，请提供：
1. 具体的错误信息
2. 当前看到的界面截图
3. 操作步骤描述

我将为您提供进一步的协助！