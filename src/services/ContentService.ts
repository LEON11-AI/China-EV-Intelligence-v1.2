import matter from 'gray-matter';

// Data type definitions
export interface IntelligenceItem {
  id: string;
  title: string;
  date: string;
  brand: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  author: string;
  read_time: number;
  importance: 'high' | 'medium' | 'low';
  is_pro: boolean;
  confidence: string;
  source: string;
  status: string;
}

export interface ModelItem {
  id: string;
  brand: string;
  model_name: string;
  status: string;
  ceo_note: string;
  images: string[];
  price_usd_estimated: [number, number];
  key_specs: {
    range_cltc: string;
    zero_to_100: string;
    power_kw: string;
    battery_kwh: string;
  };
  detailed_specs: {
    battery: {
      capacity_kwh: number;
      chemistry: string;
      supplier: string;
      voltage: string;
      warranty_years: number;
      warranty_km: number;
      degradation_rate: string;
      swappable?: boolean;
      swap_time_minutes?: number;
    };
    charging: {
      dc_fast_max_kw: number;
      dc_10_to_80_minutes: number;
      ac_max_kw: number;
      ac_0_to_100_hours: number;
      charging_ports: string[];
      battery_swap_compatible?: boolean;
    };
    performance: {
      top_speed_kmh: number;
      zero_to_100_kmh: number;
      zero_to_200_kmh?: number;
      quarter_mile_seconds: number;
      braking_100_to_0_meters: number;
      lateral_g_force: number;
    };
    efficiency: {
      wltp_kwh_per_100km: number;
      cltc_kwh_per_100km: number;
      real_world_kwh_per_100km: number;
    };
  };
  full_specs: {
    dimensions: string;
    wheelbase: string;
    powertrain: string;
    battery: string;
    charging: string;
    adas: string;
  };
  market_analysis: {
    target_segment: string;
    main_competitors: string[];
    competitive_advantages: string[];
    market_position: string;
    estimated_annual_sales_china: number;
    global_market_potential: string;
  };
  competitor_comparison: {
    [key: string]: {
      price_advantage: string;
      performance: string;
      tech: string;
      brand_prestige?: string;
      charging?: string;
    };
  };
  market_plan: {
    china_launch: string;
    global_rollout: string;
  };
  sources: Array<{
    date: string;
    type: string;
    confidence: string;
  }>;
}

class ContentService {
  private static instance: ContentService;
  private intelligenceCache: IntelligenceItem[] | null = null;
  private modelsCache: ModelItem[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  private constructor() {}

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  // Check if cache is valid
  private isCacheValid(): boolean {
    return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  // Clear cache
  public clearCache(): void {
    this.intelligenceCache = null;
    this.modelsCache = null;
    this.cacheTimestamp = 0;
  }

  // Get intelligence articles data
  public async getIntelligence(): Promise<IntelligenceItem[]> {
    if (this.intelligenceCache && this.isCacheValid()) {
      return this.intelligenceCache;
    }

    try {
      // First try to load from CMS content directory
      const cmsData = await this.loadIntelligenceFromCMS();
      if (cmsData.length > 0) {
        this.intelligenceCache = cmsData;
        this.cacheTimestamp = Date.now();
        return cmsData;
      }
    } catch (error) {
      console.warn('Failed to load intelligence from CMS, falling back to JSON:', error);
    }

    // Fallback to JSON file
    try {
      const response = await fetch('/data/intelligence.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      this.intelligenceCache = jsonData;
      this.cacheTimestamp = Date.now();
      return jsonData;
    } catch (error) {
      console.error('Failed to load intelligence data:', error);
      return [];
    }
  }

  // Get models data
  public async getModels(): Promise<ModelItem[]> {
    if (this.modelsCache && this.isCacheValid()) {
      return this.modelsCache;
    }

    try {
      // First try to load from CMS content directory
      const cmsData = await this.loadModelsFromCMS();
      if (cmsData.length > 0) {
        this.modelsCache = cmsData;
        this.cacheTimestamp = Date.now();
        return cmsData;
      }
    } catch (error) {
      console.warn('Failed to load models from CMS, falling back to JSON:', error);
    }

    // Fallback to JSON file
    try {
      const response = await fetch('/data/models.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      this.modelsCache = jsonData;
      this.cacheTimestamp = Date.now();
      return jsonData;
    } catch (error) {
      console.error('Failed to load models data:', error);
      return [];
    }
  }

  // Load intelligence articles from CMS content directory
  private async loadIntelligenceFromCMS(): Promise<IntelligenceItem[]> {
    const items: IntelligenceItem[] = [];
    
    try {
      // In production environment, actual file system access needs to be implemented here
      // Currently return empty array, waiting for data migration completion
      return items;
    } catch (error) {
      console.error('Error loading intelligence from CMS:', error);
      return [];
    }
  }

  // Load models data from CMS content directory
  private async loadModelsFromCMS(): Promise<ModelItem[]> {
    const items: ModelItem[] = [];
    
    try {
      // In production environment, actual file system access needs to be implemented here
      // Currently return empty array, waiting for data migration completion
      return items;
    } catch (error) {
      console.error('Error loading models from CMS:', error);
      return [];
    }
  }

  // Get single intelligence article by ID
  public async getIntelligenceById(id: string): Promise<IntelligenceItem | null> {
    const intelligence = await this.getIntelligence();
    return intelligence.find(item => item.id === id) || null;
  }

  // Get single model by ID
  public async getModelById(id: string): Promise<ModelItem | null> {
    const models = await this.getModels();
    return models.find(item => item.id === id) || null;
  }

  // Filter intelligence articles by brand
  public async getIntelligenceByBrand(brand: string): Promise<IntelligenceItem[]> {
    const intelligence = await this.getIntelligence();
    return intelligence.filter(item => item.brand === brand);
  }

  // Filter models by brand
  public async getModelsByBrand(brand: string): Promise<ModelItem[]> {
    const models = await this.getModels();
    return models.filter(item => item.brand === brand);
  }

  // Get latest intelligence articles
  public async getLatestIntelligence(limit: number = 5): Promise<IntelligenceItem[]> {
    const intelligence = await this.getIntelligence();
    return intelligence
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // Get active models
  public async getActiveModels(): Promise<ModelItem[]> {
    const models = await this.getModels();
    return models.filter(item => item.status === 'active');
  }

  // Get all unique categories from intelligence articles
  public async getIntelligenceCategories(): Promise<string[]> {
    const intelligence = await this.getIntelligence();
    const categories = [...new Set(intelligence.map(item => item.category))];
    return categories.sort();
  }

  // Filter intelligence articles by category
  public async getIntelligenceByCategory(category: string): Promise<IntelligenceItem[]> {
    const intelligence = await this.getIntelligence();
    return intelligence.filter(item => item.category === category);
  }

  // Get filtered intelligence with multiple criteria
  public async getFilteredIntelligence(filters: {
    category?: string;
    brand?: string;
    importance?: 'high' | 'medium' | 'low';
    limit?: number;
  }): Promise<IntelligenceItem[]> {
    let intelligence = await this.getIntelligence();
    
    if (filters.category) {
      intelligence = intelligence.filter(item => item.category === filters.category);
    }
    
    if (filters.brand) {
      intelligence = intelligence.filter(item => item.brand === filters.brand);
    }
    
    if (filters.importance) {
      intelligence = intelligence.filter(item => item.importance === filters.importance);
    }
    
    // Sort by date (newest first)
    intelligence = intelligence.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (filters.limit) {
      intelligence = intelligence.slice(0, filters.limit);
    }
    
    return intelligence;
  }
}

// Export singleton instance
export const contentService = ContentService.getInstance();
export default ContentService;