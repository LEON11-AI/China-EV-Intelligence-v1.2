# CMS GitHub 集成故障排除指南

本指南提供了 China EV Intelligence CMS GitHub 集成常见问题的解决方案和调试方法。

## 🚨 常见问题快速索引

| 问题类型 | 跳转链接 |
|---------|----------|
| 登录问题 | [→ 登录故障排除](#登录故障排除) |
| 发布问题 | [→ 发布故障排除](#发布故障排除) |
| 配置问题 | [→ 配置故障排除](#配置故障排除) |
| 性能问题 | [→ 性能故障排除](#性能故障排除) |
| 内容问题 | [→ 内容故障排除](#内容故障排除) |

---

## 🔐 登录故障排除

### 问题 1: "Login with GitHub" 按钮不显示

**症状**: CMS 后台页面空白或只显示基本界面，没有 GitHub 登录按钮

**可能原因**:
- Netlify 环境变量未正确设置
- 站点未重新部署
- 浏览器缓存问题
- CMS 配置文件错误

**解决步骤**:

1. **检查环境变量**
   ```bash
   # 在 Netlify Dashboard 中验证
   GITHUB_CLIENT_ID = Iv1.xxxxxxxxxxxxxxxx
   GITHUB_CLIENT_SECRET = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **重新部署站点**
   - 进入 Netlify Dashboard → Deploys
   - 点击 "Trigger deploy" → "Deploy site"
   - 等待部署完成（通常 2-5 分钟）

3. **清除浏览器缓存**
   ```bash
   # Chrome/Edge
   Ctrl + Shift + R (强制刷新)
   
   # 或者
   F12 → Network → 勾选 "Disable cache" → 刷新页面
   ```

4. **检查 CMS 配置**
   ```yaml
   # public/admin/config.yml
   backend:
     name: github
     repo: LEON11-AI/China-EV-Intelligence-v1.2
     branch: main
     auth_endpoint: /.netlify/functions/auth
     auth_token_endpoint: /.netlify/functions/auth/token
   ```

### 问题 2: GitHub 授权失败

**症状**: 点击登录后跳转到 GitHub，但授权后返回错误页面

**可能原因**:
- OAuth 应用回调 URL 不正确
- Client ID 或 Secret 错误
- GitHub 应用权限不足

**解决步骤**:

1. **验证 OAuth 应用设置**
   ```
   GitHub → Settings → Developer settings → OAuth Apps
   
   检查项目:
   ✅ Homepage URL: https://your-site.netlify.app
   ✅ Authorization callback URL: https://your-site.netlify.app/admin/
   ✅ 应用状态: Active
   ```

2. **重新生成 Client Secret**
   - 在 GitHub OAuth 应用中点击 "Generate a new client secret"
   - 更新 Netlify 环境变量
   - 重新部署站点

3. **检查仓库权限**
   ```bash
   # 确保 GitHub 账户对仓库有以下权限:
   ✅ Read access to metadata
   ✅ Read and write access to code
   ✅ Read and write access to pull requests
   ```

### 问题 3: 登录后立即退出

**症状**: 成功登录但几秒后自动退出到登录页面

**解决步骤**:

1. **检查浏览器控制台**
   ```javascript
   // F12 → Console，查找错误信息
   // 常见错误:
   // - "Failed to fetch user"
   // - "Invalid token"
   // - "CORS error"
   ```

2. **验证网络连接**
   ```bash
   # 测试 GitHub API 连接
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```

3. **清除本地存储**
   ```javascript
   // 在浏览器控制台执行
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

---

## 📤 发布故障排除

### 问题 4: 点击发布后没有反应

**症状**: 点击 "Publish" 按钮后没有任何反馈，内容未提交到 GitHub

**解决步骤**:

1. **检查网络请求**
   ```bash
   # F12 → Network → 点击发布 → 查看请求
   # 查找失败的 API 请求
   ```

2. **验证文件格式**
   ```yaml
   # 确保 frontmatter 格式正确
   ---
   title: "文章标题"
   date: 2024-01-20T10:00:00Z
   published: true
   ---
   
   # 内容部分
   ```

3. **检查必填字段**
   ```yaml
   # Intelligence 文章必填字段
   ✅ title
   ✅ date
   ✅ brand
   ✅ category
   ✅ source
   ✅ content
   ```

### 问题 5: 发布成功但网站未更新

**症状**: GitHub 仓库有新提交，但网站内容未更新

**解决步骤**:

1. **检查 Netlify 部署状态**
   ```bash
   # Netlify Dashboard → Deploys
   # 查看最新部署状态:
   ✅ Published
   ❌ Failed
   ⏳ Building
   ```

2. **查看构建日志**
   ```bash
   # 点击失败的部署 → 查看 "Deploy log"
   # 常见错误:
   # - Build command failed
   # - File not found
   # - Syntax error in markdown
   ```

3. **手动触发部署**
   ```bash
   # Netlify Dashboard → Deploys
   # 点击 "Trigger deploy" → "Deploy site"
   ```

### 问题 6: 文件上传失败

**症状**: 图片或 HTML 文件上传时出现错误

**解决步骤**:

1. **检查文件大小**
   ```bash
   # 文件大小限制:
   ✅ 图片: < 10MB
   ✅ HTML: < 25MB
   ✅ 其他文件: < 100MB
   ```

2. **验证文件格式**
   ```bash
   # 支持的图片格式:
   ✅ .jpg, .jpeg, .png, .gif, .webp, .svg
   
   # 支持的文档格式:
   ✅ .html, .pdf, .doc, .docx
   ```

3. **检查存储配置**
   ```yaml
   # config.yml 中的媒体设置
   media_folder: public/images/uploads
   public_folder: /images/uploads
   ```

---

## ⚙️ 配置故障排除

### 问题 7: CMS 配置文件错误

**症状**: CMS 后台显示配置错误或功能异常

**解决步骤**:

1. **验证 YAML 语法**
   ```bash
   # 使用在线 YAML 验证器检查 config.yml
   # 常见错误:
   # - 缩进不正确
   # - 引号不匹配
   # - 特殊字符未转义
   ```

2. **检查字段配置**
   ```yaml
   # 确保所有必需字段都有正确的 widget 类型
   fields:
     - {label: "Title", name: "title", widget: "string"}
     - {label: "Date", name: "date", widget: "datetime"}
   ```

3. **验证集合配置**
   ```yaml
   # 检查文件夹路径是否存在
   collections:
     - name: "intelligence"
       folder: "content/intelligence"  # 确保此文件夹存在
   ```

### 问题 8: 本地开发环境问题

**症状**: 本地 CMS 无法正常工作

**解决步骤**:

1. **检查开发服务器**
   ```bash
   # 确保开发服务器正在运行
   npm run dev
   
   # 访问 http://localhost:5173/admin/
   ```

2. **验证依赖安装**
   ```bash
   # 重新安装依赖
   npm install
   
   # 清除缓存
   npm run build
   ```

3. **检查端口冲突**
   ```bash
   # 如果 5173 端口被占用
   npm run dev -- --port 3000
   ```

---

## 🚀 性能故障排除

### 问题 9: CMS 加载缓慢

**解决步骤**:

1. **优化图片资源**
   ```bash
   # 压缩上传的图片
   # 推荐工具: TinyPNG, ImageOptim
   ```

2. **清理无用文件**
   ```bash
   # 删除不需要的媒体文件
   # 整理 content 文件夹结构
   ```

3. **检查网络连接**
   ```bash
   # 测试 CDN 响应时间
   ping your-site.netlify.app
   ```

### 问题 10: 构建时间过长

**解决步骤**:

1. **优化构建配置**
   ```javascript
   // vite.config.js
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom']
           }
         }
       }
     }
   }
   ```

2. **减少依赖包大小**
   ```bash
   # 分析包大小
   npm run build -- --analyze
   
   # 移除未使用的依赖
   npm uninstall unused-package
   ```

---

## 📝 内容故障排除

### 问题 11: 内容格式错误

**症状**: 发布的内容在网站上显示异常

**解决步骤**:

1. **检查 Markdown 语法**
   ```markdown
   # 正确的标题格式
   ## 二级标题
   
   # 正确的链接格式
   [链接文本](https://example.com)
   
   # 正确的图片格式
   ![图片描述](/images/example.jpg)
   ```

2. **验证 frontmatter**
   ```yaml
   ---
   title: "文章标题"  # 使用引号包围含特殊字符的值
   date: 2024-01-20T10:00:00Z  # 使用 ISO 8601 格式
   tags: ["标签1", "标签2"]  # 数组格式
   ---
   ```

3. **检查字符编码**
   ```bash
   # 确保文件使用 UTF-8 编码
   # 避免使用特殊字符或 emoji 在文件名中
   ```

### 问题 12: 图片无法显示

**解决步骤**:

1. **检查图片路径**
   ```markdown
   # 正确的相对路径
   ![图片](/images/uploads/example.jpg)
   
   # 错误的路径
   ![图片](../images/example.jpg)
   ```

2. **验证图片文件**
   ```bash
   # 确保图片文件存在于正确位置
   public/images/uploads/example.jpg
   ```

3. **检查图片格式**
   ```bash
   # 支持的格式
   ✅ .jpg, .jpeg, .png, .gif, .webp, .svg
   ❌ .bmp, .tiff, .raw
   ```

---

## 🛠️ 调试工具和方法

### 浏览器开发者工具

```javascript
// 检查 CMS 状态
console.log('CMS Config:', window.CMS_CONFIG);
console.log('Netlify Identity:', window.netlifyIdentity);

// 检查本地存储
console.log('Local Storage:', localStorage);
console.log('Session Storage:', sessionStorage);

// 监听 CMS 事件
window.CMS_MANUAL_INIT = true;
window.CMS.init();
```

### 网络请求调试

```bash
# 检查 API 请求
# F12 → Network → Filter: XHR/Fetch
# 查看失败的请求和响应
```

### 日志分析

```bash
# Netlify 部署日志
# Dashboard → Deploys → 选择部署 → Deploy log

# GitHub Actions 日志（如果使用）
# GitHub → Actions → 选择工作流 → 查看日志
```

---

## 📞 获取帮助

### 自助资源

1. **官方文档**
   - [Netlify CMS 文档](https://www.netlifycms.org/docs/)
   - [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
   - [Netlify 部署文档](https://docs.netlify.com/)

2. **社区支持**
   - [Netlify CMS GitHub Issues](https://github.com/netlify/netlify-cms/issues)
   - [Netlify Community Forum](https://community.netlify.com/)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/netlify-cms)

3. **项目文档**
   - [`CMS_GITHUB_INTEGRATION_GUIDE.md`](./CMS_GITHUB_INTEGRATION_GUIDE.md)
   - [`GITHUB_OAUTH_SETUP.md`](./GITHUB_OAUTH_SETUP.md)
   - [`NETLIFY_ENV_SETUP.md`](./NETLIFY_ENV_SETUP.md)

### 报告问题

当遇到无法解决的问题时，请提供以下信息：

```
问题描述: [详细描述问题]
复现步骤: [如何重现问题]
预期结果: [期望的正确行为]
实际结果: [实际发生的情况]
环境信息:
  - 浏览器: [Chrome/Firefox/Safari + 版本]
  - 操作系统: [Windows/macOS/Linux]
  - CMS 版本: [从 package.json 获取]
错误信息: [控制台错误或截图]
```

---

## 🔄 定期维护

### 每月检查清单

- [ ] 检查 Netlify 部署状态
- [ ] 验证 GitHub OAuth 应用状态
- [ ] 清理无用的媒体文件
- [ ] 更新依赖包版本
- [ ] 备份重要内容

### 安全检查

- [ ] 审查 GitHub 访问日志
- [ ] 检查环境变量安全性
- [ ] 验证用户权限设置
- [ ] 更新 OAuth 密钥（建议每6个月）

---

**最后更新**: 2024年1月20日  
**版本**: 1.0.0  
**维护者**: China EV Intelligence 技术团队