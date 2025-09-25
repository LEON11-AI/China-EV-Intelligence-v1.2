# Vercel部署问题修复说明

## 问题描述
Vercel部署时出现错误："应该运行以下必须具有有效版本，例如'now-php@1.0.0'"

## 问题原因
原始的vercel.json配置中包含了`functions`配置，可能导致Vercel误判项目需要PHP运行时。

## 解决方案

### 1. 简化vercel.json配置
已将vercel.json简化为：
```json
{
  "framework": "vite",
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/admin/(.*)",
      "destination": "/admin/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. 手动触发部署
由于网络问题无法推送到GitHub，请在Vercel控制台手动触发部署：

1. 登录Vercel控制台
2. 找到项目
3. 点击"Deployments"标签
4. 点击"Redeploy"按钮
5. 选择"Use existing Build Cache"选项
6. 点击"Redeploy"

### 3. 验证修复
部署完成后，应该能看到：
- 构建成功完成
- 没有PHP相关错误
- 网站正常访问

### 4. 后续步骤
部署成功后，可以配置自定义域名 voltchina.net：
1. 在Vercel项目设置中添加域名
2. 在域名注册商处配置DNS记录
3. Vercel会自动处理SSL证书

## 技术细节
- 移除了可能导致运行时误判的`functions`配置
- 保留了必要的路由重写规则
- 使用专用的Vercel构建配置文件