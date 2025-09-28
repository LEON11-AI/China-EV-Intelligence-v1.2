import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 数据同步脚本：将CMS发布的HTML报告同步到前端数据文件
 * 从 public/admin/content/html_reports.json 同步到 public/data/html_reports.json
 */

class HtmlReportsSync {
  constructor() {
    this.cmsFilePath = path.join(__dirname, '../public/admin/content/html_reports.json');
    this.frontendFilePath = path.join(__dirname, '../public/data/html_reports.json');
  }

  /**
   * 读取CMS文件
   */
  readCmsFile() {
    try {
      if (!fs.existsSync(this.cmsFilePath)) {
        console.log('CMS文件不存在:', this.cmsFilePath);
        return [];
      }
      
      const data = fs.readFileSync(this.cmsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取CMS文件失败:', error.message);
      return [];
    }
  }

  /**
   * 转换数据格式：从CMS格式转换为前端格式
   */
  transformData(cmsData) {
    return cmsData.map(item => {
      // 生成前端需要的HTML内容
      const htmlContent = this.generateHtmlContent(item);
      
      return {
        id: item.id || this.generateId(item.title),
        title: item.title,
        date: item.date,
        brand: item.brand || 'Unknown',
        category: item.category || 'Market Analysis',
        source: item.source || 'China EV Intelligence',
        confidence: item.confidence || 'high',
        is_pro: item.is_pro || false,
        tags: item.tags || [],
        summary: item.summary,
        raw_html_content: htmlContent,
        author: item.author || 'China EV Intelligence Team',
        reading_time: item.reading_time || 5,
        importance: item.importance || 'Medium',
        published: true,
        type: 'html_report',
        html_file: item.html_file || this.generateHtmlFileName(item.title)
      };
    });
  }

  /**
   * 生成HTML内容
   */
  generateHtmlContent(item) {
    // 如果CMS中已有HTML文件路径，尝试读取
    if (item.html_file) {
      const htmlFilePath = path.join(__dirname, '../public', item.html_file);
      if (fs.existsSync(htmlFilePath)) {
        try {
          return fs.readFileSync(htmlFilePath, 'utf8');
        } catch (error) {
          console.warn('读取HTML文件失败:', htmlFilePath, error.message);
        }
      }
    }

    // 生成基础HTML模板
    return this.generateBasicHtml(item);
  }

  /**
   * 生成基础HTML模板
   */
  generateBasicHtml(item) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${item.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <header class="gradient-bg text-white py-16">
        <div class="container mx-auto px-6">
            <div class="text-center">
                <h1 class="text-5xl font-bold mb-4">${item.title}</h1>
                <p class="text-xl opacity-90 mb-6">${item.summary}</p>
                <div class="flex justify-center items-center space-x-6 text-sm">
                    <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full">${item.category}</span>
                    <span>${item.date}</span>
                    <span>${item.reading_time} min read</span>
                </div>
            </div>
        </div>
    </header>
    
    <main class="container mx-auto px-6 py-12">
        <section class="mb-16">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-6">报告内容</h2>
                <div class="prose max-w-none">
                    <p class="text-gray-600 leading-relaxed">${item.summary}</p>
                </div>
            </div>
        </section>
    </main>
    
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-6 text-center">
            <p class="text-gray-400">© 2024 China EV Intelligence. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }

  /**
   * 生成ID
   */
  generateId(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * 生成HTML文件名
   */
  generateHtmlFileName(title) {
    return this.generateId(title) + '.html';
  }

  /**
   * 写入前端文件
   */
  writeFrontendFile(data) {
    try {
      // 确保目录存在
      const dir = path.dirname(this.frontendFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 写入文件
      fs.writeFileSync(this.frontendFilePath, JSON.stringify(data, null, 2), 'utf8');
      console.log('✅ 前端数据文件更新成功:', this.frontendFilePath);
      return true;
    } catch (error) {
      console.error('❌ 写入前端文件失败:', error.message);
      return false;
    }
  }

  /**
   * 执行同步
   */
  async sync() {
    console.log('🔄 开始同步HTML报告数据...');
    
    // 读取CMS数据
    const cmsData = this.readCmsFile();
    if (cmsData.length === 0) {
      console.log('⚠️  CMS文件为空或不存在，跳过同步');
      return false;
    }

    console.log(`📖 读取到 ${cmsData.length} 条CMS数据`);

    // 转换数据格式
    const frontendData = this.transformData(cmsData);
    console.log(`🔄 转换完成，生成 ${frontendData.length} 条前端数据`);

    // 写入前端文件
    const success = this.writeFrontendFile(frontendData);
    
    if (success) {
      console.log('✅ HTML报告数据同步完成！');
      console.log('📁 CMS文件:', this.cmsFilePath);
      console.log('📁 前端文件:', this.frontendFilePath);
    }

    return success;
  }
}

// 直接执行同步
const sync = new HtmlReportsSync();
sync.sync().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('同步过程中发生错误:', error);
  process.exit(1);
});

export default HtmlReportsSync;