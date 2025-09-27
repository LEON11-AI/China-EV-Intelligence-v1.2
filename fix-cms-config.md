# CMS 配置修复指南

## 🚀 快速修复步骤

### 第一步：创建 GitHub OAuth 应用

1. **访问 GitHub OAuth 设置**
   ```
   https://github.com/settings/developers
   ```

2. **点击 "New OAuth App"**

3. **填写应用信息**
   ```
   Application name: China EV Intelligence CMS
   Homepage URL: https://your-actual-netlify-site.netlify.app
   Application description: CMS for China EV Intelligence website
   Authorization callback URL: https://your-actual-netlify-site.netlify.app/admin/
   ```
   
   ⚠️ **重要**: 请将 `your-actual-netlify-site` 替换为你的实际 Netlify 站点名称

4. **获取凭据**
   - 复制 `Client ID`（格式类似：Iv1.xxxxxxxxxxxxxxxx）
   - 点击 "Generate a new client secret" 并复制 `Client Secret`

### 第二步：配置 Netlify 环境变量

1. **登录 Netlify Dashboard**
   ```
   https://app.netlify.com/
   ```

2. **选择你的站点**

3. **进入环境变量设置**
   ```
   Site settings → Environment variables → Add variable
   ```

4. **添加以下变量**
   ```
   变量名: GITHUB_CLIENT_ID
   值: [从 GitHub OAuth 应用复制的 Client ID]
   
   变量名: GITHUB_CLIENT_SECRET
   值: [从 GitHub OAuth 应用复制的 Client Secret]
   ```

### 第三步：重新部署站点

1. **触发新部署**
   ```
   Netlify Dashboard → Deploys → Trigger deploy → Deploy site
   ```

2. **等待部署完成**
   - 通常需要 2-5 分钟
   - 确保状态显示为 "Published"

### 第四步：测试 CMS 功能

1. **访问 CMS 后台**
   ```
   https://your-actual-netlify-site.netlify.app/admin/
   ```

2. **验证登录**
   - 应该看到 "Login with GitHub" 按钮
   - 点击登录，跳转到 GitHub 授权页面
   - 授权后应该成功进入 CMS 界面

## 🔍 验证清单

### GitHub OAuth 应用
- [ ] OAuth 应用已创建
- [ ] Homepage URL 正确（使用实际的 Netlify 域名）
- [ ] 回调 URL 正确（以 `/admin/` 结尾）
- [ ] Client ID 和 Secret 已获取

### Netlify 环境变量
- [ ] `GITHUB_CLIENT_ID` 已添加
- [ ] `GITHUB_CLIENT_SECRET` 已添加
- [ ] 变量值正确无误（无多余空格）
- [ ] 站点已重新部署

### CMS 测试
- [ ] CMS 后台可以访问
- [ ] 显示 "Login with GitHub" 按钮
- [ ] 可以成功登录
- [ ] 可以看到内容管理界面

## 🚨 常见问题

### 问题 1: 仍然显示 "Not Found"
**解决方法**:
1. 检查环境变量名称拼写
2. 确保已重新部署
3. 清除浏览器缓存（Ctrl+Shift+R）

### 问题 2: "Login with GitHub" 按钮不显示
**解决方法**:
1. 检查浏览器控制台错误（F12）
2. 验证环境变量是否正确设置
3. 确认部署状态为成功

### 问题 3: GitHub 授权后返回错误
**解决方法**:
1. 检查回调 URL 是否正确
2. 确认 OAuth 应用状态为 Active
3. 验证 Client Secret 是否正确

## 📞 需要帮助？

如果按照以上步骤仍无法解决问题：

1. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签页的错误信息

2. **查看 Netlify 部署日志**
   - 在 Netlify Dashboard 中查看最新部署的详细日志

3. **验证网络连接**
   - 确保可以正常访问 GitHub 和 Netlify

4. **检查仓库权限**
   - 确保 GitHub 账户对仓库有读写权限

---

**提示**: 完成配置后，建议测试创建一篇新文章并发布，以验证整个工作流程是否正常。