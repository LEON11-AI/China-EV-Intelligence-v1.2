# Netlify 环境变量配置指南

本指南详细说明如何在 Netlify 中配置环境变量，以支持 GitHub OAuth 集成和 CMS 功能。

## 前提条件

在开始之前，请确保您已经：
1. 完成了 GitHub OAuth 应用的创建（参考 `GITHUB_OAUTH_SETUP.md`）
2. 获得了 GitHub OAuth Client ID 和 Client Secret
3. 拥有 Netlify 账户和已部署的站点

## 步骤 1: 访问 Netlify 站点设置

### 1.1 登录 Netlify
1. 访问 [Netlify](https://app.netlify.com)
2. 使用您的账户登录

### 1.2 选择站点
1. 在仪表板中找到您的 `China EV Intelligence` 站点
2. 点击站点名称进入站点详情页面

### 1.3 进入环境变量设置
1. 在站点详情页面，点击 **Site settings**
2. 在左侧菜单中选择 **Environment variables**

## 步骤 2: 添加必需的环境变量

### 2.1 添加 GitHub Client ID
1. 点击 **Add a variable** 按钮
2. 填写以下信息：
   - **Key**: `GITHUB_CLIENT_ID`
   - **Value**: 您的 GitHub OAuth Client ID（例如：`Iv1.a629723bfa4c2283`）
   - **Scopes**: 选择 **All scopes**
3. 点击 **Create variable**

### 2.2 添加 GitHub Client Secret
1. 再次点击 **Add a variable** 按钮
2. 填写以下信息：
   - **Key**: `GITHUB_CLIENT_SECRET`
   - **Value**: 您的 GitHub OAuth Client Secret
   - **Scopes**: 选择 **All scopes**
3. 点击 **Create variable**

### 2.3 验证环境变量
确保您的环境变量列表包含：
```
GITHUB_CLIENT_ID = Iv1.xxxxxxxxxxxxxxxxx
GITHUB_CLIENT_SECRET = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 步骤 3: 重新部署站点

### 3.1 触发新部署
添加环境变量后，需要重新部署站点以使变量生效：

1. 在站点设置页面，点击顶部的 **Deploys** 标签
2. 点击 **Trigger deploy** 按钮
3. 选择 **Deploy site**
4. 等待部署完成（通常需要 1-3 分钟）

### 3.2 检查部署状态
1. 在 **Deploys** 页面查看最新部署的状态
2. 确保部署状态为 **Published**
3. 记录部署时间，用于后续验证

## 步骤 4: 验证配置

### 4.1 访问 CMS 后台
1. 访问您的站点 CMS 后台：`https://your-site-name.netlify.app/admin/`
2. 页面应该显示 "Login with GitHub" 按钮
3. 如果看不到按钮，请检查浏览器控制台是否有错误信息

### 4.2 测试 GitHub 登录
1. 点击 "Login with GitHub" 按钮
2. 您应该被重定向到 GitHub 授权页面
3. 点击 **Authorize** 授权应用访问
4. 成功后应该返回到 CMS 后台并显示内容管理界面

### 4.3 测试内容发布
1. 在 CMS 后台创建一个测试文章
2. 填写必要的字段
3. 点击 **Publish** 按钮
4. 检查 GitHub 仓库是否有新的提交
5. 确认 Netlify 是否自动触发了新的部署

## 环境变量安全最佳实践

### 安全建议
1. **限制访问权限**: 只给需要的团队成员提供 Netlify 站点的访问权限
2. **定期轮换密钥**: 建议每 3-6 个月更新一次 GitHub OAuth Client Secret
3. **监控使用情况**: 定期检查 GitHub OAuth 应用的使用日志
4. **备份配置**: 将环境变量配置信息安全地备份

### 变量管理
1. **命名规范**: 使用清晰、一致的命名规范
2. **文档记录**: 为每个环境变量添加说明注释
3. **版本控制**: 不要将敏感信息提交到代码仓库

## 故障排除

### 问题 1: 环境变量未生效
**症状**: CMS 后台仍显示错误或无法连接 GitHub

**解决方案**:
1. 确认环境变量名称拼写正确
2. 检查变量值是否包含额外的空格或特殊字符
3. 重新部署站点
4. 清除浏览器缓存

### 问题 2: GitHub 授权失败
**症状**: 点击 "Login with GitHub" 后出现错误

**解决方案**:
1. 检查 GitHub OAuth 应用的回调 URL 设置
2. 确认 Client ID 和 Client Secret 正确
3. 检查 GitHub OAuth 应用是否处于活跃状态

### 问题 3: 部署失败
**症状**: 添加环境变量后部署失败

**解决方案**:
1. 检查部署日志中的错误信息
2. 确认环境变量值格式正确
3. 尝试删除并重新添加环境变量

## 高级配置

### 多环境支持
如果您需要支持多个环境（开发、测试、生产），可以：

1. 为不同环境创建不同的 GitHub OAuth 应用
2. 使用不同的环境变量前缀
3. 在 `config.yml` 中使用条件配置

### 自动化部署
您可以设置 GitHub Webhooks 来自动触发部署：

1. 在 GitHub 仓库设置中添加 Webhook
2. 设置 Payload URL 为 Netlify 的构建钩子 URL
3. 选择触发事件（如 push、pull request 等）

## 下一步

配置完成后，您的 CMS 系统将具备：
1. GitHub 集成登录功能
2. 直接发布到 GitHub 仓库的能力
3. 自动触发 Netlify 部署
4. 完整的内容管理工作流

如需更多帮助，请参考：
- [Netlify 环境变量文档](https://docs.netlify.com/environment-variables/overview/)
- [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- 项目的其他配置文档