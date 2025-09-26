# Netlify 环境变量配置指南

## 问题分析

如果您在 Netlify 部署的网站上看到邮件订阅功能显示 "Something went wrong. Please try again." 错误，这是因为：

1. **环境变量未配置**：Netlify 部署时没有读取到本地的 `.env` 文件
2. **构建时环境变量缺失**：Vite 构建过程中无法访问 EmailJS 配置
3. **需要重新部署**：即使配置了环境变量，也需要触发新的部署

## 解决方案

### 方法一：在 Netlify 控制台配置环境变量（推荐）

1. **登录 Netlify 控制台**
   - 访问 [https://app.netlify.com/](https://app.netlify.com/)
   - 登录您的账户

2. **选择您的项目**
   - 找到 `voltchina.net` 项目（或您的项目名称）
   - 点击进入项目详情页

3. **进入环境变量设置**
   - 点击 "Site settings" 按钮
   - 在左侧菜单中选择 "Environment variables"

4. **添加环境变量**
   点击 "Add variable" 按钮，依次添加以下三个变量：
   
   ```
   变量名: VITE_EMAILJS_SERVICE_ID
   值: service_csdf2xr
   ```
   
   ```
   变量名: VITE_EMAILJS_TEMPLATE_ID
   值: template_7738ci9
   ```
   
   ```
   变量名: VITE_EMAILJS_PUBLIC_KEY
   值: gn1ooFeEuYfRYr_Lo
   ```

5. **保存配置**
   - 点击 "Save" 保存每个环境变量
   - 确保所有三个变量都已正确添加

6. **触发重新部署**
   - 返回项目主页
   - 点击 "Deploys" 标签
   - 点击 "Trigger deploy" → "Deploy site"
   - 等待部署完成（通常需要 1-3 分钟）

### 方法二：通过 GitHub 自动部署（推荐长期使用）

如果您已经连接了 GitHub 仓库：

1. **更新 GitHub 仓库**
   - 确保本地 `.env` 文件包含正确的 EmailJS 配置
   - 提交并推送到 GitHub

2. **在 Netlify 配置环境变量**
   - 按照上述方法一的步骤 3-5 配置环境变量

3. **自动重新部署**
   - Netlify 会自动检测到 GitHub 的更新
   - 自动触发新的部署

### 方法三：重新手动部署

如果使用拖拽部署方式：

1. **本地构建**
   ```bash
   npm run build
   ```

2. **配置环境变量**
   - 在 Netlify 控制台按方法一配置环境变量

3. **重新拖拽部署**
   - 将新生成的 `dist` 文件夹拖拽到 Netlify
   - 或者在现有项目中点击 "Deploys" → "Deploy site" → 拖拽 `dist` 文件夹

## 验证配置

部署完成后：

1. **访问您的网站**
   - 打开 Netlify 提供的网站链接
   - 滚动到邮件订阅部分

2. **测试邮件订阅**
   - 输入一个测试邮箱地址
   - 点击 "Subscribe" 按钮
   - 应该看到成功提示而不是错误信息

3. **检查浏览器控制台**
   - 按 F12 打开开发者工具
   - 查看 Console 标签是否有错误信息

## 常见问题

### Q: 为什么本地可以工作但线上不行？
A: 本地开发时 Vite 会自动读取 `.env` 文件，但 Netlify 部署时需要单独配置环境变量。

### Q: 配置了环境变量但还是不工作？
A: 确保：
- 变量名完全正确（包括 `VITE_` 前缀）
- 变量值没有多余的空格或引号
- 已经触发了重新部署

### Q: 如何确认环境变量是否生效？
A: 在浏览器控制台中输入 `import.meta.env` 可以查看当前可用的环境变量。

## 注意事项

1. **安全性**：环境变量中的 EmailJS Public Key 是公开的，这是正常的
2. **缓存**：部署后可能需要清除浏览器缓存才能看到更新
3. **域名**：如果使用自定义域名，确保 DNS 设置正确

---

按照以上步骤操作后，您的邮件订阅功能应该可以正常工作了。如果仍有问题，请检查 EmailJS 账户状态和配额限制。