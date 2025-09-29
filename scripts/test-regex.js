import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试文件
const testFile = path.join(__dirname, '..', 'content', 'intelligence', 'intel_001.md');
const content = fs.readFileSync(testFile, 'utf8');

console.log('文件内容前20行:');
console.log(content.split('\n').slice(0, 20).join('\n'));
console.log('\n===================\n');

// 测试不同的正则表达式
const patterns = [
  /category:\s*["']technology["']/g,
  /category:\s*"technology"/g,
  /category: "technology"/g,
  /category:\s*"[^"]*"/g
];

patterns.forEach((pattern, index) => {
  const matches = content.match(pattern);
  console.log(`Pattern ${index + 1}: ${pattern}`);
  console.log(`Matches:`, matches);
  console.log('');
});

// 查找category行
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('category')) {
    console.log(`Line ${index + 1}: "${line}"`);
  }
});