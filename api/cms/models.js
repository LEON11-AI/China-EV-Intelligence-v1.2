// CMS API endpoint for models data
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
    // Read models data from JSON file
    const dataPath = path.join(__dirname, '../../src/data/models.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const modelsData = JSON.parse(rawData);

    // Transform data to match CMS structure
    const cmsData = modelsData.map(item => ({
      id: item.id,
      title: `${item.brand} ${item.model}`,
      brand: item.brand,
      model: item.model,
      status: item.status,
      ceo_note: item.ceo_note,
      images: Array.isArray(item.images) ? item.images : [item.image].filter(Boolean),
      price_usd_estimated: item.price_usd_estimated,
      key_specs: item.key_specs,
      detailed_specs: item.detailed_specs,
      market_analysis: item.market_analysis,
      competitor_comparison: item.competitor_comparison,
      pricing_history: item.pricing_history,
      user_ratings: item.user_ratings,
      sales_data: item.sales_data,
      full_specs: item.full_specs,
      market_plan: item.market_plan,
      sources: item.sources,
      date: item.date,
      updated_date: item.updated_date,
      published: item.published !== false
    }));

    res.status(200).json(cmsData);
  } catch (error) {
    console.error('Error loading models data:', error);
    res.status(500).json({ error: 'Failed to load models data' });
  }
}