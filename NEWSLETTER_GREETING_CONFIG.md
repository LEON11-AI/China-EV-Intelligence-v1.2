# Newsletter Subscription Greeting Configuration

## 问题解决

之前邮件订阅功能中出现中文称呼（"尊敬的[姓名]"），导致中英文混合的问题。现在已经修复并提供了可配置的称呼格式选项。

## 新功能：可配置称呼格式

`NewsletterSubscription` 组件现在支持 `greetingStyle` 属性，可以配置不同的邮件称呼格式：

### 可用选项

1. **`formal`** (默认): "Dear [姓名]"
2. **`casual`**: "Hi [姓名]"
3. **`chinese`**: "尊敬的[姓名]"

### 使用方法

```tsx
// 默认使用正式英文称呼
<NewsletterSubscription />

// 使用随意英文称呼
<NewsletterSubscription greetingStyle="casual" />

// 使用中文称呼
<NewsletterSubscription greetingStyle="chinese" />

// 在不同变体中使用
<NewsletterSubscription 
  variant="hero" 
  greetingStyle="formal" 
/>
```

### 邮件效果示例

假设用户输入姓名为 "张三"：

- **formal**: "Dear 张三,"
- **casual**: "Hi 张三,"
- **chinese**: "尊敬的张三,"

## 技术实现

### 代码变更

1. **接口更新**: 添加了 `greetingStyle` 可选属性
2. **称呼生成函数**: 新增 `getGreeting()` 函数处理不同格式
3. **EmailJS 集成**: 使用动态生成的称呼替换硬编码值

### 核心函数

```typescript
const getGreeting = (name: string, style: string) => {
  const trimmedName = name.trim();
  switch (style) {
    case 'formal':
      return `Dear ${trimmedName}`;
    case 'casual':
      return `Hi ${trimmedName}`;
    case 'chinese':
      return `尊敬的${trimmedName}`;
    default:
      return `Dear ${trimmedName}`;
  }
};
```

## 默认行为

- 如果不指定 `greetingStyle`，默认使用 `formal` 格式
- 这确保了纯英文的邮件称呼，避免中英文混合
- 保持了向后兼容性

## 注意事项

1. **EmailJS 模板配置**: 确保 EmailJS 模板中使用 `{{to_name}}` 变量
2. **字符编码**: 如果使用中文称呼，确保 EmailJS 支持 UTF-8 编码
3. **测试**: 每次更改称呼格式后都应进行测试

## 故障排除

如果邮件称呼仍然显示不正确：

1. 检查 EmailJS 模板是否使用了正确的 `{{to_name}}` 变量
2. 确认 `greetingStyle` 属性值正确
3. 清除浏览器缓存后重新测试
4. 检查浏览器控制台是否有错误信息