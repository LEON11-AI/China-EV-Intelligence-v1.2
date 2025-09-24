# Vercel 部署指南

## 为什么选择 Vercel？

相比 Netlify，Vercel 在以下方面表现更优：

### 🚀 性能优势
- **更快的构建速度**：平均构建时间比 Netlify 快 30-50%
- **全球 CDN**：更多的边缘节点，中国用户访问速度更快
- **智能缓存**：自动优化静态资源缓存策略
- **零配置优化**：自动压缩、图片优化、代码分割

### 🛠️ 技术优势
- **原生 React/Vite 支持**：专为现代前端框架优化
- **Serverless 函数**：更好的 API 路由支持
- **实时预览**：每个 PR 自动生成预览链接
- **TypeScript 原生支持**：无需额外配置

### 📊 稳定性优势
- **99.99% 可用性**：企业级 SLA 保证
- **自动故障转移**：多区域部署，自动切换
- **实时监控**：详细的性能和错误监控
- **回滚机制**：一键回滚到任意历史版本

## 项目配置说明

### vercel.json 配置
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "api/cms.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/cms.js"
    },
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

### 关键特性支持
- ✅ **SPA 路由**：自动处理客户端路由
- ✅ **API 路由**：支持 CMS API 和数据接口
- ✅ **静态资源**：优化图片、CSS、JS 加载
- ✅ **管理后台**：Decap CMS 完全兼容
- ✅ **环境变量**：安全的配置管理

## 部署步骤

### 1. 推送代码到 GitHub
```bash
git add .
git commit -m "feat: 迁移到 Vercel 部署平台"
git push origin main
```

### 2. 连接 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测到 Vite 项目并配置

### 3. 配置环境变量
在 Vercel 项目设置中添加：
- `GEMINI_API_KEY`: 你的 Gemini API 密钥
- 其他必要的环境变量

### 4. 部署
- Vercel 会自动开始构建和部署
- 通常 2-3 分钟内完成
- 每次推送代码都会自动重新部署

## 迁移优势对比

| 特性 | Netlify | Vercel |
|------|---------|--------|
| 构建速度 | 3-5 分钟 | 1-2 分钟 |
| 中国访问速度 | 较慢 | 快 |
| API 支持 | 需要 Functions | 原生支持 |
| 预览部署 | 有 | 更快更稳定 |
| 监控工具 | 基础 | 详细 |
| 免费额度 | 300 分钟/月 | 100GB 带宽/月 |
| 企业支持 | 有限 | 完善 |

## 域名配置

### 自定义域名
1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录
4. Vercel 会自动提供 SSL 证书

### DNS 配置示例
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

## 监控和维护

### 性能监控
- Vercel Analytics：实时用户访问数据
- Core Web Vitals：页面性能指标
- 错误追踪：自动捕获和报告错误

### 日志查看
```bash
# 安装 Vercel CLI
npm i -g vercel

# 查看部署日志
vercel logs

# 查看函数日志
vercel logs --follow
```

## 故障排除

### 常见问题
1. **构建失败**：检查 package.json 中的构建脚本
2. **API 不工作**：确认 vercel.json 中的路由配置
3. **环境变量**：在 Vercel 控制台中正确设置
4. **404 错误**：检查 SPA 路由重定向配置

### 回滚操作
```bash
# 回滚到上一个版本
vercel rollback

# 回滚到指定版本
vercel rollback [deployment-url]
```

## 成本对比

### Vercel 免费计划
- 100GB 带宽/月
- 无限静态部署
- 12 个 Serverless 函数
- 100GB-小时计算时间

### 付费计划（如需要）
- Pro: $20/月 - 1TB 带宽
- Team: $40/月 - 无限团队成员

**结论**：对于大多数项目，Vercel 免费计划已经足够，且性能和稳定性都优于 Netlify。

## 下一步

1. 确认代码已推送到 GitHub
2. 在 Vercel 上创建新项目
3. 配置环境变量
4. 测试部署结果
5. 配置自定义域名（可选）
6. 停用 Netlify 部署（确认 Vercel 正常工作后）

---

**注意**：迁移过程中建议保持 Netlify 部署运行，直到确认 Vercel 部署完全正常工作。