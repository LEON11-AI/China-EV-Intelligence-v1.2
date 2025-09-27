# GitHub OAuth 应用配置指南

本指南将帮助您为 China EV Intelligence CMS 配置 GitHub OAuth 应用，实现通过 CMS 后台直接发布内容到 GitHub 仓库。

## 步骤 1: 创建 GitHub OAuth 应用

### 1.1 访问 GitHub 设置
1. 登录到您的 GitHub 账户
2. 点击右上角头像，选择 **Settings**
3. 在左侧菜单中选择 **Developer settings**
4. 选择 **OAuth Apps**
5. 点击 **New OAuth App**

### 1.2 填写应用信息
填写以下信息：

- **Application name**: `China EV Intelligence CMS`
- **Homepage URL**: `https://your-site-name.netlify.app`（替换为您的实际 Netlify 域名）
- **Application description**: `CMS for China EV Intelligence website`
- **Authorization callback URL**: `https://your-site-name.netlify.app/admin/`（替换为您的实际域名）

### 1.3 获取客户端信息
创建应用后，您将获得：
- **Client ID**: 类似 `Iv1.a629723bfa4c2283`
- **Client Secret**: 点击 **Generate a new client secret** 生成（只显示一次，请妥善保存）

## 步骤 2: 配置 Netlify 环境变量

### 2.1 访问 Netlify 站点设置
1. 登录到 [Netlify](https://app.netlify.com)
2. 选择您的站点
3. 进入 **Site settings**
4. 选择 **Environment variables**

### 2.2 添加环境变量
添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|----|---------|
| `GITHUB_CLIENT_ID` | 您的 GitHub OAuth Client ID | 从步骤 1.3 获得 |
| `GITHUB_CLIENT_SECRET` | 您的 GitHub OAuth Client Secret | 从步骤 1.3 获得 |

### 2.3 重新部署站点
添加环境变量后，需要重新部署站点：
1. 在 Netlify 控制台中，进入 **Deploys** 页面
2. 点击 **Trigger deploy** > **Deploy site**

## 步骤 3: 验证配置

### 3.1 访问 CMS 后台
1. 访问 `https://your-site-name.netlify.app/admin/`
2. 您应该看到 "Login with GitHub" 按钮
3. 点击按钮进行 GitHub 授权

### 3.2 测试功能
1. 登录成功后，尝试创建一个测试文章
2. 点击 **Publish** 按钮
3. 检查 GitHub 仓库是否有新的提交
4. 确认 Netlify 是否自动触发了新的部署

## 常见问题排除

### 问题 1: "Login with GitHub" 按钮不显示
**可能原因**:
- Netlify 环境变量未正确设置
- 站点未重新部署

**解决方案**:
1. 检查 Netlify 环境变量是否正确设置
2. 重新部署站点
3. 清除浏览器缓存

### 问题 2: GitHub 授权失败
**可能原因**:
- OAuth 应用的回调 URL 不正确
- Client ID 或 Client Secret 错误

**解决方案**:
1. 检查 GitHub OAuth 应用的回调 URL 是否为 `https://your-site-name.netlify.app/admin/`
2. 确认环境变量中的 Client ID 和 Client Secret 正确

### 问题 3: 发布后内容未出现在网站上
**可能原因**:
- Netlify 自动部署未触发
- 内容文件路径不正确

**解决方案**:
1. 检查 GitHub 仓库是否有新提交
2. 检查 Netlify 部署日志
3. 确认内容文件保存在正确的目录中

## 安全注意事项

1. **保护 Client Secret**: 永远不要在前端代码中暴露 GitHub Client Secret
2. **定期轮换密钥**: 建议定期更新 OAuth 应用的 Client Secret
3. **限制权限**: OAuth 应用只需要对指定仓库的写入权限
4. **监控访问**: 定期检查 GitHub OAuth 应用的访问日志

## 下一步

配置完成后，您可以：
1. 通过 CMS 后台创建和编辑内容
2. 直接发布内容到 GitHub 仓库
3. 自动触发 Netlify 部署
4. 实现完全的内容管理工作流

如需更多帮助，请参考 [Netlify CMS 官方文档](https://www.netlifycms.org/docs/github-backend/) 或联系技术支持。