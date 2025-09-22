
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
