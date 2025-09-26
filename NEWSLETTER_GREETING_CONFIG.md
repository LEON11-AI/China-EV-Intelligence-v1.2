# Newsletter Subscription Greeting Configuration

## Issue Resolution

Previously, the email subscription feature contained Chinese greetings ("尊敬的[name]"), causing mixed Chinese-English content issues. This has been fixed and now provides configurable English greeting format options.

## Feature: Configurable Greeting Formats

The `NewsletterSubscription` component now supports the `greetingStyle` property to configure different email greeting formats:

### Available Options

1. **`formal`** (default): "Dear [name]"
2. **`casual`**: "Hi [name]"

### Usage

```tsx
// 默认使用正式英文称呼
<NewsletterSubscription />

// 使用随意英文称呼
<NewsletterSubscription greetingStyle="casual" />



// Use with different variants
<NewsletterSubscription 
  variant="hero" 
  greetingStyle="formal" 
/>
```

### Email Effect Examples

Assuming user input name is "John":

- **formal**: "Dear John,"
- **casual**: "Hi John,"

## Technical Implementation

### Code Changes

1. **Interface Update**: Added optional `greetingStyle` property
2. **Greeting Generation Function**: Added `getGreeting()` function to handle different formats
3. **EmailJS Integration**: Uses dynamically generated greetings to replace hardcoded values

### Core Function

```typescript
const getGreeting = (name: string, style: string) => {
  const trimmedName = name.trim();
  switch (style) {
    case 'formal':
      return `Dear ${trimmedName}`;
    case 'casual':
      return `Hi ${trimmedName}`;

    default:
      return `Dear ${trimmedName}`;
  }
};
```

## Default Behavior

- If `greetingStyle` is not specified, defaults to `formal` format
- This ensures pure English email greetings, avoiding mixed Chinese-English content
- Maintains backward compatibility

## Notes

1. **EmailJS Template Configuration**: Ensure EmailJS template uses `{{to_name}}` variable
2. **Character Encoding**: Ensure EmailJS supports UTF-8 encoding for international names
3. **Testing**: Test after each greeting format change

## Troubleshooting

If email greetings still display incorrectly:

1. Check if EmailJS template uses the correct `{{to_name}}` variable
2. Confirm `greetingStyle` property value is correct
3. Clear browser cache and retest
4. Check browser console for error messages