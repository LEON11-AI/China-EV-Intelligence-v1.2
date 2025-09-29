// 在浏览器控制台中运行此测试脚本
// 复制以下代码到浏览器开发者工具的控制台中执行

console.log('=== 阅读量统计功能测试 ===');

// 模拟导入analytics函数（在实际浏览器环境中这些函数应该已经可用）
// 这里我们直接测试localStorage的基本功能

// 测试1: 测试localStorage基本功能
console.log('\n1. 测试localStorage基本功能:');
try {
  localStorage.setItem('test_key', 'test_value');
  const value = localStorage.getItem('test_key');
  console.log(`localStorage测试: ${value === 'test_value' ? '成功' : '失败'}`);
  localStorage.removeItem('test_key');
} catch (error) {
  console.error('localStorage不可用:', error);
}

// 测试2: 模拟阅读量数据结构
console.log('\n2. 测试阅读量数据结构:');
const testData = {
  totalViews: 0,
  totalArticles: 0,
  articles: {},
  lastUpdated: new Date().toISOString(),
  metadata: {
    version: '1.0.0',
    created: new Date().toISOString()
  }
};

try {
  localStorage.setItem('analytics_data', JSON.stringify(testData));
  const stored = JSON.parse(localStorage.getItem('analytics_data') || '{}');
  console.log('数据结构测试成功:', stored);
} catch (error) {
  console.error('数据结构测试失败:', error);
}

// 测试3: 模拟用户指纹生成
console.log('\n3. 测试用户指纹生成:');
const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Browser fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // 简单哈希
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  
  return Math.abs(hash).toString(36);
};

const fingerprint = generateFingerprint();
console.log('生成的用户指纹:', fingerprint);

// 测试4: 模拟防刷机制
console.log('\n4. 测试防刷机制:');
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24小时
const testArticleId = 'test-article-1';
const currentTime = Date.now();

// 模拟第一次访问
const viewRecord = {
  articleId: testArticleId,
  timestamp: currentTime,
  userFingerprint: fingerprint
};

const viewRecords = [viewRecord];
localStorage.setItem('view_records', JSON.stringify(viewRecords));
console.log('第一次访问记录已保存');

// 模拟立即重复访问（应该被阻止）
const isInCooldown = viewRecords.some(record => 
  record.articleId === testArticleId && 
  record.userFingerprint === fingerprint && 
  (currentTime - record.timestamp) < COOLDOWN_PERIOD
);

console.log(`重复访问检测: ${isInCooldown ? '被阻止（正确）' : '允许（错误）'}`);

// 测试5: 清理测试数据
console.log('\n5. 清理测试数据:');
localStorage.removeItem('analytics_data');
localStorage.removeItem('view_records');
console.log('测试数据已清理');

console.log('\n=== 测试完成 ===');
console.log('请在浏览器中访问文章页面，观察ViewCounter组件是否正常显示阅读量');
console.log('然后访问 /analytics 页面查看统计仪表板');
console.log('最后访问首页查看热门文章模块');