
export interface CarModel {
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
  detailed_specs?: {
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
      quarter_mile_seconds?: number;
      braking_100_to_0_meters: number;
      lateral_g_force: number;
      tank_turn_capable?: boolean;
    };
    efficiency: {
      wltp_kwh_per_100km: number;
      cltc_kwh_per_100km: number;
      real_world_kwh_per_100km: number;
    };
  };
  market_analysis?: {
    target_segment: string;
    main_competitors: string[];
    competitive_advantages: string[];
    market_position: string;
    estimated_annual_sales_china: number;
    global_market_potential: string;
  };
  competitor_comparison?: {
    [key: string]: {
      price_advantage: string;
      performance: string;
      tech: string;
      charging?: string;
      brand_prestige?: string;
    };
  };
  pricing_history?: {
    launch_price_cny: [number, number];
    current_price_cny: [number, number];
    price_changes: any[];
    incentives_available: string[];
  };
  user_ratings?: {
    overall_score: number;
    performance_score: number;
    comfort_score: number;
    tech_score: number;
    value_score: number;
    total_reviews: number;
    owner_satisfaction: number;
  };
  sales_data?: {
    monthly_sales_china: number[];
    cumulative_sales: number;
    market_share_segment: number;
    sales_trend: string;
    waiting_time_weeks: number;
    pre_orders?: number;
  };
  full_specs: {
    dimensions: string;
    wheelbase: string;
    powertrain: string;
    battery: string;
    charging: string;
    adas: string;
  };
  market_plan: {
    china_launch: string;
    global_rollout: string;
  };
  sources: {
    date: string;
    type: string;
    confidence: string;
  }[];
}

export interface IntelligenceItem {
  id: string;
  date: string;
  brand: string;
  model: string;
  title: string;
  source: string;
  status: string;
  confidence: string;
  is_pro: boolean;
  content: string;
}
