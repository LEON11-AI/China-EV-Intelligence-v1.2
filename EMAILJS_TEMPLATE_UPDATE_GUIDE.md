# EmailJS 邮件模板称呼优化指南

## 问题描述

用户反馈邮件订阅系统中的称呼显示为"Hi China EV Intelligence,"而不是订阅者自己的姓名。这是因为EmailJS模板配置不正确，没有使用用户输入的姓名字段。

## 解决方案

### 1. 代码层面的修改

已更新 `src/components/NewsletterSubscription.tsx` 文件，添加了姓名输入字段并在EmailJS模板参数中使用用户输入的姓名：

```javascript
// 添加了姓名状态
const [name, setName] = useState('');

// 表单验证包含姓名检查
if (!name || name.trim().length < 2) {
  setStatus('error');
  setMessage('Please enter your name');
  return;
}

// 使用用户输入的姓名
const templateParams = {
  to_email: email,
  to_name: `尊敬的${name.trim()}`, // 使用用户输入的姓名
  from_name: 'China EV Intelligence',
  message: 'Thank you for subscribing to our newsletter! You will receive the latest insights about China\'s electric vehicle industry.',
};
```

### 2. EmailJS 模板更新

您需要在EmailJS控制台中更新邮件模板，将称呼部分修改为：

**问题模板（显示错误称呼）：**
```
Hi China EV Intelligence,
```

**正确模板（使用用户姓名）：**
```
{{to_name}}，
```

### 3. 完整的推荐模板结构

```
Subject: Welcome to China EV Intelligence Newsletter!

{{to_name}}，

Thank you for subscribing to China EV Intelligence newsletter!

You'll now receive the latest insights, analysis, and trends about China's electric vehicle industry directly in your inbox.

Best regards,
China EV Intelligence Team

Email: {{to_email}}
From: {{from_name}}
Message: {{message}}
```

## 更新步骤

### 步骤1：登录EmailJS控制台
1. 访问 [EmailJS](https://www.emailjs.com/)
2. 登录您的账户

### 步骤2：编辑邮件模板
1. 进入 "Email Templates" 页面
2. 找到您当前使用的模板
3. 点击 "Edit" 按钮

### 步骤3：更新模板内容
1. 找到邮件开头的称呼部分（可能是 "Hi China EV Intelligence," 或其他错误称呼）
2. 将其替换为 "{{to_name}}，"
3. 确保模板中正确使用了 {{to_name}} 变量
4. 保存模板

### 步骤4：测试更新
1. 重新部署网站（如果在生产环境）
2. 在订阅表单中输入姓名和邮箱
3. 测试邮件订阅功能
4. 检查收到的邮件是否显示"尊敬的[您输入的姓名]，"

## 其他称呼选项

如果您希望使用其他称呼方式，可以在代码中修改 `to_name` 的格式：

- `\`尊敬的${name.trim()}\`` - 正式、礼貌（当前设置）
- `\`亲爱的${name.trim()}\`` - 友好、亲切
- `\`${name.trim()}，您好\`` - 简洁、通用
- `\`Dear ${name.trim()}\`` - 英文正式称呼
- `\`Hello ${name.trim()}\`` - 英文简洁称呼

## 注意事项

1. **模板变量**：确保EmailJS模板中使用了 `{{to_name}}` 变量
2. **字符编码**：如果使用中文称呼，确保EmailJS支持UTF-8编码
3. **测试**：每次修改后都要进行测试，确保邮件正常发送
4. **一致性**：保持称呼风格与品牌调性一致

## 故障排除

如果更新后仍有问题：

1. **检查模板变量**：确认EmailJS模板中正确使用了 `{{to_name}}`
2. **清除缓存**：清除浏览器缓存后重新测试
3. **检查控制台**：查看浏览器控制台是否有错误信息
4. **验证配置**：确认EmailJS的Service ID、Template ID和Public Key都正确配置

## 重要变更说明

现在订阅表单包含两个字段：
1. **姓名字段** - 用户输入他们的姓名
2. **邮箱字段** - 用户输入他们的邮箱地址

---

更新完成后，用户将收到以"尊敬的[用户输入的姓名]，"开头的邮件，实现了个性化称呼。