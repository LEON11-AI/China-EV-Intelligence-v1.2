// CMS API endpoint for intelligence data
// This is a simple implementation that serves data from JSON files
// In production, this would connect to your actual CMS database

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read intelligence data from JSON file
    const dataPath = path.join(__dirname, '../../src/data/intelligence.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const intelligenceData = JSON.parse(rawData);

    // Transform data to match CMS structure
    const cmsData = intelligenceData.map(item => ({
      id: item.id,
      title: item.title,
      date: item.date,
      brand: item.brand,
      model: item.model || '',
      category: item.category,
      tags: item.tags || [],
      summary: item.summary,
      image: item.image,
      content: item.content,
      author: item.author,
      reading_time: item.reading_time,
      importance: item.importance,
      published: item.published !== false,
      seo_title: item.seo_title,
      seo_description: item.seo_description,
      related_links: item.related_links || [],
      data_sources: item.data_sources || [],
      featured: item.featured || false,
      source: item.source || 'Internal',
      status: item.status || 'verified',
      confidence: item.confidence || 'high',
      is_pro: item.is_pro || false
    }));

    res.status(200).json(cmsData);
  } catch (error) {
    console.error('Error loading intelligence data:', error);
    res.status(500).json({ error: 'Failed to load intelligence data' });
  }
}