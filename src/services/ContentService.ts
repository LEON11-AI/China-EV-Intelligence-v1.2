import matter from 'gray-matter';

// Data type definitions
export interface IntelligenceItem {
  id: string;
  title: string;
  date: string;
  brand: string;
  model?: string;
  category: string;
  source: string;
  status: 'verified' | 'pending' | 'rumor';
  confidence: 'high' | 'medium' | 'low';
  is_pro: boolean;
  tags: string[];
  summary: string;
  content: string;
  author: string;
  reading_time: number;
  importance: 'High' | 'Medium' | 'Low';
  published: boolean;
  seo_title?: string;
  seo_description?: string;
  related_links?: Array<{
    title: string;
    url: string;
  }>;
  data_sources?: string[];
  featured: boolean;
}

export interface ModelItem {
  id: string;
  title: string;
  brand: string;
  model: string;
  status: 'available' | 'pre_order' | 'concept' | 'discontinued';
  ceo_note?: string;
  images: Array<{
    url: string;
  }>;
  price_usd_estimated: Array<{
    variant: string;
    price: number;
  }>;
  key_specs: {
    range_km: number;
    battery_kwh: number;
    power_kw: number;
    acceleration_0_100: number;
    top_speed_kmh: number;
    seating: number;
    drive_type: string;
  };
  detailed_specs: {
    battery: {
      capacity_kwh: number;
      type: string;
      supplier: string;
      warranty_years: number;
    };
    charging: {
      dc_fast_kw: number;
      ac_slow_kw: number;
      time_10_80_min: number;
      connector_type: string;
    };
    performance: {
      motor_type: string;
      total_power_kw: number;
      total_torque_nm: number;
      drive_config: string;
    };
    efficiency: {
      wltp_kwh_100km: number;
      nedc_kwh_100km: number;
      epa_kwh_100km: number;
    };
  };
  market_analysis: {
    target_market: string;
    positioning: string;
    key_selling_points: string[];
    market_challenges: string[];
    expected_sales_volume: string;
  };
  competitor_comparison: Array<{
    competitor: string;
    price_difference: string;
    key_advantages: string[];
    key_disadvantages: string[];
  }>;
  pricing_history: Array<{
    date: string;
    price_usd: number;
    notes: string;
  }>;
  user_ratings: {
    overall: number;
    performance: number;
    range: number;
    charging: number;
    interior: number;
    technology: number;
    value: number;
    total_reviews: number;
  };
  sales_data: {
    monthly_sales: Array<{
      month: string;
      units: number;
    }>;
    total_sales: number;
    market_share_percent: number;
  };
  full_specs: {
    dimensions: {
      length_mm: number;
      width_mm: number;
      height_mm: number;
      wheelbase_mm: number;
      ground_clearance_mm: number;
    };
    weight: {
      curb_weight_kg: number;
      gross_weight_kg: number;
      payload_kg: number;
    };
    interior: {
      seating_capacity: number;
      cargo_volume_l: number;
      infotainment_screen: string;
      driver_display: string;
    };
    safety: {
      ncap_rating: string;
      safety_features: string[];
      adas_features: string[];
    };
    connectivity: {
      ota_updates: boolean;
      mobile_app: boolean;
      wifi_hotspot: boolean;
      bluetooth: string;
    };
  };
  market_plan: {
    launch_timeline: {
      announcement: string;
      pre_orders: string;
      deliveries: string;
      mass_production: string;
    };
    production_targets: {
      year_1: number;
      year_2: number;
      year_3: number;
    };
    market_expansion: {
      domestic_launch: string;
      export_markets: string[];
      international_launch: string;
    };
  };
  sources: Array<{
    type: string;
    url: string;
    date: string;
    reliability: string;
  }>;
  updated_date: string;
  published: boolean;
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

    // Load directly from JSON file (skip CMS API for now)
    try {
      const response = await fetch('/data/intelligence.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      
      // Merge with HTML reports
      const htmlReports = await this.loadHtmlReports();
      const combinedData = [...jsonData, ...htmlReports];
      
      this.intelligenceCache = combinedData;
      this.cacheTimestamp = Date.now();
      return combinedData;
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

    // Load directly from JSON file (skip CMS API for now)
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

  // Load intelligence from CMS
  private async loadIntelligenceFromCMS(): Promise<IntelligenceItem[]> {
    try {
      // TODO: Replace with actual CMS API endpoint
      const response = await fetch('/backend-api/cms/intelligence');
      if (!response.ok) {
        throw new Error('Failed to fetch from CMS');
      }
      
      const cmsData = await response.json();
      
      // Transform CMS data to match our interface
      return cmsData.map((item: any) => ({
        id: item.id || item.slug,
        date: item.date || item.published_date,
        brand: item.brand,
        model: item.model || '',
        title: item.title,
        source: item.source,
        status: item.status || 'pending',
        confidence: item.confidence || 'medium',
        is_pro: item.is_pro || false,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        summary: item.summary || '',
        author: item.author,
        reading_time: item.reading_time || 5,
        importance: item.importance || 'Medium',
        published: item.published !== false,
        seo_title: item.seo_title,
        seo_description: item.seo_description,
        related_links: item.related_links || [],
        data_sources: item.data_sources || [],
        featured: item.featured || false
      }));
    } catch (error) {
      console.warn('Failed to load intelligence from CMS:', error);
      return [];
    }
  }

  // Load HTML reports from CMS
  private async loadHtmlReports(): Promise<IntelligenceItem[]> {
    try {
      const response = await fetch('/admin/content/html_reports.json');
      if (!response.ok) {
        // If no HTML reports exist, return empty array
        return [];
      }
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Not JSON, probably an HTML error page
        return [];
      }
      
      const htmlReportsData = await response.json();
      
      // Transform HTML reports data to match IntelligenceItem interface
      return htmlReportsData.map((item: any) => ({
        id: item.id || `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title,
        date: item.date,
        brand: item.brand,
        model: item.model || '',
        category: item.category,
        source: item.source || '',
        status: item.status || 'verified',
        confidence: item.confidence || 'high',
        is_pro: item.is_pro || false,
        tags: item.tags || [],
        summary: item.summary || '',
        content: `html:${item.html_file}`, // Special prefix to indicate HTML content
        author: item.author || 'China EV Intelligence',
        reading_time: item.reading_time || 10,
        importance: item.importance || 'High',
        published: item.published !== false,
        seo_title: item.seo_title || item.title,
        seo_description: item.seo_description || item.summary,
        related_links: item.related_links || [],
        data_sources: item.data_sources || [],
        featured: item.featured || false
      }));
    } catch (error) {
      // Silently return empty array - this is expected when no HTML reports exist
      return [];
    }
  }

  // Load models from CMS
  private async loadModelsFromCMS(): Promise<ModelItem[]> {
    try {
      // TODO: Replace with actual CMS API endpoint
      const response = await fetch('/backend-api/cms/models');
      if (!response.ok) {
        throw new Error('Failed to fetch from CMS');
      }
      
      const cmsData = await response.json();
      
      // Transform CMS data to match our interface
      return cmsData.map((item: any) => ({
        id: item.id || item.slug,
        title: item.title || `${item.brand} ${item.model}`,
        brand: item.brand,
        model: item.model,
        status: item.status || 'available',
        ceo_note: item.ceo_note || '',
        images: Array.isArray(item.images) ? item.images : [item.image || item.featured_image].filter(Boolean),
        price_usd_estimated: item.price_usd_estimated || [],
        key_specs: item.key_specs || {
          range_km: 0,
          battery_kwh: 0,
          power_kw: 0,
          acceleration_0_100: 0,
          top_speed_kmh: 0,
          seating: 0,
          drive_type: ''
        },
        detailed_specs: item.detailed_specs || {
          battery: {
            capacity_kwh: 0,
            type: '',
            supplier: '',
            warranty_years: 0
          },
          charging: {
            dc_fast_kw: 0,
            ac_slow_kw: 0,
            time_10_80_min: 0,
            connector_type: ''
          },
          performance: {
            motor_type: '',
            total_power_kw: 0,
            total_torque_nm: 0,
            drive_config: ''
          },
          efficiency: {
            wltp_kwh_100km: 0,
            nedc_kwh_100km: 0,
            epa_kwh_100km: 0
          }
        },
        market_analysis: item.market_analysis || {
          target_market: '',
          positioning: '',
          key_selling_points: [],
          market_challenges: [],
          expected_sales_volume: ''
        },
        competitor_comparison: item.competitor_comparison || [],
        pricing_history: item.pricing_history || [],
        user_ratings: item.user_ratings || {
          overall: 0,
          performance: 0,
          range: 0,
          charging: 0,
          interior: 0,
          technology: 0,
          value: 0,
          total_reviews: 0
        },
        sales_data: item.sales_data || {
          monthly_sales: [],
          total_sales: 0,
          market_share_percent: 0
        },
        full_specs: item.full_specs || {
          dimensions: {
            length_mm: 0,
            width_mm: 0,
            height_mm: 0,
            wheelbase_mm: 0,
            ground_clearance_mm: 0
          },
          weight: {
            curb_weight_kg: 0,
            gross_weight_kg: 0,
            payload_kg: 0
          },
          interior: {
            seating_capacity: 0,
            cargo_volume_l: 0,
            infotainment_screen: '',
            driver_display: ''
          },
          safety: {
            ncap_rating: '',
            safety_features: [],
            adas_features: []
          },
          connectivity: {
            ota_updates: false,
            mobile_app: false,
            wifi_hotspot: false,
            bluetooth: ''
          }
        },
        market_plan: item.market_plan || {
          launch_timeline: {
            announcement: '',
            pre_orders: '',
            deliveries: '',
            mass_production: ''
          },
          production_targets: {
            year_1: 0,
            year_2: 0,
            year_3: 0
          },
          market_expansion: {
            domestic_launch: '',
            export_markets: [],
            international_launch: ''
          }
        },
        sources: item.sources || [],
        updated_date: item.updated_date,
        published: item.published !== false
      }));
    } catch (error) {
      console.warn('Failed to load models from CMS:', error);
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
    return models.filter(item => item.status === 'available');
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
    importance?: 'High' | 'Medium' | 'Low';
    is_pro?: boolean;
    status?: 'verified' | 'pending' | 'rumor';
    confidence?: 'high' | 'medium' | 'low';
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
    
    if (filters.is_pro !== undefined) {
      intelligence = intelligence.filter(item => item.is_pro === filters.is_pro);
    }
    
    if (filters.status) {
      intelligence = intelligence.filter(item => item.status === filters.status);
    }
    
    if (filters.confidence) {
      intelligence = intelligence.filter(item => item.confidence === filters.confidence);
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