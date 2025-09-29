import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 类别映射：旧值 -> 新值
const categoryMapping = {
  'technology': 'Technical Analysis',
  'market_analysis': 'Market Dynamics',
  'manufacturing': 'Corporate News',
  'policy': 'Policy Analysis',
  'corporate': 'Corporate News'
};

// 获取intelligence文件夹路径
const intelligenceDir = path.join(__dirname, '..', 'content', 'intelligence');

// 更新单个文件的category字段
function updateFileCategory(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;
    
    // 查找并替换category字段
    for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
      const regex = new RegExp(`category:\s*["']${oldCategory}["']`, 'g');
      const beforeReplace = updatedContent;
      updatedContent = updatedContent.replace(regex, `category: "${newCategory}"`);
      
      if (beforeReplace !== updatedContent) {
        console.log(`  ✨ Replacing "${oldCategory}" with "${newCategory}" in ${path.basename(filePath)}`);
        hasChanges = true;
      }
    }
    
    // 如果内容有变化，写回文件
    if (hasChanges) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// 主函数
function updateAllCategories() {
  console.log('🚀 开始更新intelligence文件的category字段...');
  console.log('📋 类别映射:');
  Object.entries(categoryMapping).forEach(([old, newCat]) => {
    console.log(`   ${old} -> ${newCat}`);
  });
  console.log('');
  
  try {
    const files = fs.readdirSync(intelligenceDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(intelligenceDir, file));
    
    let updatedCount = 0;
    
    files.forEach(filePath => {
      if (updateFileCategory(filePath)) {
        updatedCount++;
      }
    });
    
    console.log('');
    console.log(`🎉 完成！共处理 ${files.length} 个文件，更新了 ${updatedCount} 个文件`);
    
  } catch (error) {
    console.error('❌ 处理过程中出错:', error.message);
  }
}

// 执行更新
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, '/'))) {
  updateAllCategories();
} else {
  // 直接执行，用于调试
  updateAllCategories();
}

export { updateAllCategories, categoryMapping };