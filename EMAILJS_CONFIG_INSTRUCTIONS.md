# EmailJS配置说明

## 问题诊断

当前邮件订阅功能显示"Something went wrong. Please try again."错误，这是因为EmailJS服务尚未正确配置。

## 解决方案

### 步骤1：注册EmailJS账户

1. 访问 [EmailJS官网](https://www.emailjs.com/)
2. 注册免费账户
3. 验证邮箱地址

### 步骤2：创建邮件服务

1. 登录EmailJS控制台
2. 点击"Email Services"
3. 点击"Add New Service"
4. 选择邮件提供商（推荐Gmail）
5. 按照指引完成配置
6. 记录下**Service ID**

### 步骤3：创建邮件模板

1. 点击"Email Templates"
2. 点击"Create New Template"
3. 使用以下模板内容：

```
主题：欢迎订阅中国电动汽车情报！

您好，

感谢您订阅中国电动汽车情报newsletter！

您将收到关于中国电动汽车行业的最新见解、分析和趋势。

此致，
中国电动汽车情报团队

订阅邮箱：{{to_email}}
发送方：{{from_name}}
消息：{{message}}
```

4. 保存模板并记录**Template ID**

### 步骤4：获取公钥

1. 进入"Account" > "General"
2. 找到并复制**Public Key**

### 步骤5：配置环境变量

1. 打开项目根目录的`.env`文件
2. 将占位符替换为真实的配置：

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=你的实际service_id
VITE_EMAILJS_TEMPLATE_ID=你的实际template_id
VITE_EMAILJS_PUBLIC_KEY=你的实际public_key
```

### 步骤6：重启开发服务器

```bash
npm run dev
```

## 测试验证

1. 打开网站首页
2. 在邮件订阅区域输入有效邮箱
3. 点击"Subscribe"按钮
4. 检查是否收到确认邮件

## 错误排查

### 常见错误信息及解决方案：

- **"Email service is not configured"** - 检查.env文件中的配置是否为空
- **"Email service is not properly configured"** - 检查配置值是否还是占位符（包含xxxxxxx）
- **"Email template not found"** - 检查Template ID是否正确
- **"Email service not configured"** - 检查Service ID是否正确
- **"Email service authentication failed"** - 检查Public Key是否正确

## 安全注意事项

- 不要将`.env`文件提交到版本控制系统
- EmailJS的Public Key可以安全地在前端使用
- 确保邮件服务在EmailJS控制台中处于活跃状态

## 支持

如果按照以上步骤操作后仍有问题，请检查：
1. 浏览器控制台的错误信息
2. EmailJS控制台的服务状态
3. 网络连接是否正常