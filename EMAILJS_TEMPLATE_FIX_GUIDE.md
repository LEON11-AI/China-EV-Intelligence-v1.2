# EmailJS 模板称呼问题修复指南

## 问题分析

用户反馈邮件订阅功能中称呼仍显示为 "Hi China EV Intelligence" 而不是订阅者的姓名。经过代码检查，发现：

### 代码层面（✅ 正确）
- `NewsletterSubscription.tsx` 中正确发送了用户姓名数据
- `templateParams` 配置正确：`to_name: \`尊敬的${name.trim()}\``
- 表单包含姓名输入字段并进行验证

### EmailJS 模板层面（❌ 需要修复）
**问题根源**：EmailJS 模板中使用了错误的变量 `{{from_name}}` 而不是 `{{to_name}}`。

**重要区别**：
- `{{from_name}}`：发送者名称（China EV Intelligence）
- `{{to_name}}`：接收者名称（订阅者的姓名）

## 立即修复步骤

### 步骤 1：登录 EmailJS 控制台
1. 访问 [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. 使用您的账户登录

### 步骤 2：检查当前模板
1. 点击左侧菜单 "Email Templates"
2. 找到您正在使用的模板（通过 Template ID 识别）
3. 点击模板名称进入编辑页面

### 步骤 3：修复模板内容

**当前错误的模板（用户截图显示）：**
```
Subject: Welcome to China EV Intelligence Newsletter!

Hi {{from_name}},  ← 错误：这会显示 "China EV Intelligence"

Thank you for subscribing!
...
```

**或者硬编码的错误版本：**
```
Hi China EV Intelligence,  ← 错误：硬编码的发送者名称
```

**正确的模板应该是：**
```
Subject: Welcome to China EV Intelligence Newsletter!

{{to_name}}，  ← 使用变量而不是硬编码

Thank you for subscribing! You've officially joined a global community of EV enthusiasts, industry professionals, and investors dedicated to China's electric vehicle revolution.

What you can expect:
• Weekly market insights and analysis
• Latest EV technology developments
• Industry trends and forecasts
• Exclusive interviews and reports

Best regards,
China EV Intelligence Team

---
Email: {{to_email}}
From: {{from_name}}
```

### 步骤 4：保存并测试
1. 点击 "Save" 保存模板
2. 返回网站测试订阅功能
3. 输入您的姓名和邮箱
4. 检查收到的邮件是否显示 "尊敬的[您的姓名]，"

## 常见问题排查

### 问题 1：显示发送者名称而不是订阅者名称
**原因**：使用了 `{{from_name}}` 而不是 `{{to_name}}`
**解决**：将模板中的 `{{from_name}}` 改为 `{{to_name}}`

### 问题 2：模板变量不生效
**原因**：变量语法错误
**解决**：确保使用 `{{to_name}}` 而不是 `{to_name}` 或其他格式

### 问题 3：仍显示旧称呼
**原因**：模板缓存或未正确保存
**解决**：
1. 刷新 EmailJS 控制台页面
2. 重新编辑并保存模板
3. 等待 1-2 分钟让更改生效

### 问题 4：邮件发送失败
**原因**：模板 ID 不匹配
**解决**：检查 `.env` 文件中的 `VITE_EMAILJS_TEMPLATE_ID` 是否与实际模板 ID 一致

## 验证修复成功

修复成功后，用户应该收到以下格式的邮件：

```
Subject: Welcome to China EV Intelligence Newsletter!

尊敬的张三，  ← 显示用户输入的实际姓名

Thank you for subscribing! You've officially joined a global community...
```

## 环境变量检查

确保以下环境变量正确配置：

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id  ← 确保这个 ID 对应正确的模板
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 紧急联系

如果问题仍然存在：
1. 检查 EmailJS 控制台中的 "Logs" 页面查看发送记录
2. 确认模板 ID 是否正确
3. 验证模板中是否真的使用了 `{{to_name}}` 变量
4. 测试时使用不同的邮箱地址避免缓存问题

---

**重要提醒**：修改 EmailJS 模板后，更改通常在 1-2 分钟内生效。如果立即测试可能仍看到旧版本。