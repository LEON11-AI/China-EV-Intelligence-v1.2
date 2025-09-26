# Netlify 重新部署指南

## 问题描述
Netlify 部署失败，错误信息：`Cannot find module '@rollup/rollup-linux-x64-gnu'`

## 解决方案
我们已经修复了 `package-lock.json` 文件，现在包含了所有平台的 rollup 依赖，包括 Linux 平台。

## 重新部署步骤

### 方法一：通过 Netlify 控制台重新部署
1. 登录 [Netlify](https://app.netlify.com/)
2. 找到你的项目（voltchina.net）
3. 点击 "Site settings" 或 "Deploys" 标签
4. 点击 "Trigger deploy" 按钮
5. 选择 "Deploy site" 重新部署

### 方法二：推送代码触发自动部署（如果已连接 GitHub）
如果你的 Netlify 项目已经连接到 GitHub 仓库：
1. 任何推送到 main 分支的代码都会自动触发部署
2. 由于我们已经修复了依赖问题，新的部署应该会成功

### 方法三：手动上传新的构建文件
1. 在本地运行 `npm run build` 生成新的 `dist` 文件夹
2. 在 Netlify 控制台中，拖拽新的 `dist` 文件夹到部署区域

## 验证部署成功
1. 部署完成后，访问你的网站
2. 测试邮件订阅功能，确保不再显示错误信息
3. 检查 Netlify 部署日志，确认没有构建错误

## 注意事项
- 确保 Netlify 项目中配置了正确的环境变量（如果需要）
- 如果仍然遇到问题，请检查 Netlify 的构建日志获取详细错误信息

## 修复内容
✅ 更新了 `package-lock.json` 包含跨平台 rollup 依赖
✅ 验证了本地构建成功
✅ 确认包含了 `@rollup/rollup-linux-x64-gnu` 依赖

现在 Netlify 部署应该能够成功完成！