const fs = require('fs');
const path = require('path');

// 获取项目根目录
const projectRoot = path.resolve(__dirname, '..');
const dataDir = path.join(projectRoot, 'public', 'data');
const contentDir = path.join(projectRoot, 'content');

// 确保内容目录存在
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

// 转换情报文章数据
function migrateIntelligence() {
    console.log('Migrating intelligence data...');
    
    const intelligenceFile = path.join(dataDir, 'intelligence.json');
    const intelligenceData = JSON.parse(fs.readFileSync(intelligenceFile, 'utf8'));
    
    const intelligenceContentDir = path.join(contentDir, 'intelligence');
    ensureDirectoryExists(intelligenceContentDir);
    
    intelligenceData.forEach(item => {
        const frontMatter = {
            id: item.id,
            title: item.title,
            date: item.date,
            brand: item.brand,
            category: item.category || 'general',
            tags: item.tags || [],
            summary: item.summary || '',
            author: item.author || 'China EV Intelligence',
            reading_time: item.reading_time || '5 min',
            importance: item.importance || 'medium',
            image: item.image || ''
        };
        
        const markdownContent = `---
${Object.entries(frontMatter)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
                }
                return `${key}: ${JSON.stringify(value)}`;
            })
            .join('\n')}
---

${item.content || item.summary || ''}
`;
        
        const filename = `${item.id}.md`;
        const filepath = path.join(intelligenceContentDir, filename);
        
        fs.writeFileSync(filepath, markdownContent, 'utf8');
        console.log(`Created: ${filename}`);
    });
    
    console.log(`Migrated ${intelligenceData.length} intelligence articles`);
}

// 转换车型数据
function migrateModels() {
    console.log('Migrating models data...');
    
    const modelsFile = path.join(dataDir, 'models.json');
    const modelsData = JSON.parse(fs.readFileSync(modelsFile, 'utf8'));
    
    const modelsContentDir = path.join(contentDir, 'models');
    ensureDirectoryExists(modelsContentDir);
    
    modelsData.forEach(model => {
        const frontMatter = {
            id: model.id,
            brand: model.brand,
            model_name: model.model_name,
            status: model.status,
            ceo_note: model.ceo_note,
            images: model.images || [],
            price_usd_estimated: model.price_usd_estimated || [0, 0],
            range_cltc: model.key_specs?.range_cltc || '',
            zero_to_100: model.key_specs?.zero_to_100 || '',
            power_kw: model.key_specs?.power_kw || '',
            battery_kwh: model.key_specs?.battery_kwh || '',
            battery_capacity: model.detailed_specs?.battery?.capacity_kwh || '',
            charging_time: model.detailed_specs?.charging?.dc_10_to_80_minutes || '',
            drivetrain: model.detailed_specs?.drivetrain?.type || '',
            release_date: model.release_date || '',
            last_updated: model.last_updated || new Date().toISOString().split('T')[0]
        };
        
        // 构建描述内容
        let description = model.description || '';
        
        // 添加市场分析
        if (model.market_analysis) {
            description += `\n\n## 市场分析\n\n`;
            if (model.market_analysis.target_segment) {
                description += `**目标细分市场**: ${model.market_analysis.target_segment}\n\n`;
            }
            if (model.market_analysis.competitive_advantages) {
                description += `**竞争优势**: ${model.market_analysis.competitive_advantages.join(', ')}\n\n`;
            }
            if (model.market_analysis.market_positioning) {
                description += `**市场定位**: ${model.market_analysis.market_positioning}\n\n`;
            }
        }
        
        // 添加技术亮点
        if (model.tech_highlights) {
            description += `\n\n## 技术亮点\n\n${model.tech_highlights.join('\n- ')}\n`;
        }
        
        const markdownContent = `---
${Object.entries(frontMatter)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}:\n${value.map(v => `  - ${JSON.stringify(v)}`).join('\n')}`;
                }
                return `${key}: ${JSON.stringify(value)}`;
            })
            .join('\n')}
---

${description}
`;
        
        const filename = `${model.id}.md`;
        const filepath = path.join(modelsContentDir, filename);
        
        fs.writeFileSync(filepath, markdownContent, 'utf8');
        console.log(`Created: ${filename}`);
    });
    
    console.log(`Migrated ${modelsData.length} car models`);
}

// 主函数
function main() {
    console.log('Starting data migration...');
    console.log(`Project root: ${projectRoot}`);
    console.log(`Data directory: ${dataDir}`);
    console.log(`Content directory: ${contentDir}`);
    
    try {
        migrateIntelligence();
        migrateModels();
        console.log('\nData migration completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Review the generated Markdown files in the content/ directory');
        console.log('2. Test the CMS admin interface at /admin/');
        console.log('3. Verify that the ContentService can load data from both sources');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// 运行迁移
if (require.main === module) {
    main();
}

module.exports = { migrateIntelligence, migrateModels };